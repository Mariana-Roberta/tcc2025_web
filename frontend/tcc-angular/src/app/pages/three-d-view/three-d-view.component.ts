import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type PacoteOtimo = Readonly<{
  x: number;
  y: number;
  z: number;
  comprimento: number;
  largura: number;
  altura: number;
  pacoteId: number;
  pedidoId: number;
}>;

@Component({
  selector: 'app-three-d-view',
  standalone: true,
  templateUrl: './three-d-view.component.html',
  styleUrls: ['./three-d-view.component.css']
})
export class ThreeDViewComponent implements OnInit, OnChanges, OnDestroy {
  // ❗️Troquei o nome do template-ref para #host (ver HTML)
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  @Input() pacotesOtimizados: ReadonlyArray<PacoteOtimo> = [];
  @Input() caminhao: { comprimento: number; largura: number; altura: number } = {
    comprimento: 0,
    largura: 0,
    altura: 0
  };

  @Input() loading: boolean | undefined;
  @Output() coresGeradasChange = new EventEmitter<Map<string, string>>(); // key: "pedidoId|pacoteId"

  // THREE objects
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;

  // meshes
  private truckMesh?: THREE.Mesh;
  private boxes: THREE.Mesh[] = [];

  // cores por par "pedidoId|pacoteId"
  private coresGeradas: Map<string, THREE.Color> = new Map();

  // estado
  private initialized = false;
  private animationId: number | null = null;
  private readonly onResize = () => this.onWindowResize();

  ngOnInit(): void {
    this.ensureInit();
    window.addEventListener('resize', this.onResize);
    // Ajuste tardio para quando o container renderiza depois
    setTimeout(() => this.onWindowResize(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ensureInit();

    if (
      changes['pacotesOtimizados'] &&
      !this.arraysIguais(
        changes['pacotesOtimizados'].previousValue as PacoteOtimo[] | undefined,
        changes['pacotesOtimizados'].currentValue as PacoteOtimo[] | undefined
      )
    ) {
      this.criarPacotes(this.pacotesOtimizados);
    }

    if (changes['caminhao'] && this.initialized) {
      this.desenharCaminhao();
      if (this.pacotesOtimizados?.length) {
        this.criarPacotes(this.pacotesOtimizados);
      }
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);

    // cancela loop
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // dispose dos objetos THREE para evitar vazamento
    this.clearBoxes();
    if (this.truckMesh) {
      this.scene?.remove(this.truckMesh);
      (this.truckMesh.geometry as THREE.BufferGeometry)?.dispose?.();
      const mat: any = this.truckMesh.material;
      if (Array.isArray(mat)) mat.forEach(m => m.dispose?.());
      else mat?.dispose?.();
      this.truckMesh = undefined;
    }

    this.controls?.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      // remove canvas do DOM
      const host = this.hostRef?.nativeElement;
      if (host && this.renderer.domElement?.parentElement === host) {
        host.removeChild(this.renderer.domElement);
      }
      this.renderer = undefined;
    }

    // limpa cena/câmera
    this.scene = undefined;
    this.camera = undefined;
  }

  // ============ Init idempotente ============
  private ensureInit(): void {
    if (this.initialized) return;
    const host = this.hostRef?.nativeElement;
    if (!host) return;

    this.initThreeJS();
    this.desenharCaminhao();
    this.setupControls();
    this.animate();

    this.initialized = true;
  }

  // ============ Utils ============
  private arraysIguais(a: PacoteOtimo[] | undefined = [], b: PacoteOtimo[] | undefined = []): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    return a.every((val, index) => JSON.stringify(val) === JSON.stringify(b[index]));
  }

  // ============ THREE setup ============
  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    const host = this.hostRef.nativeElement;
    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(10.3, 6.7, 7.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    host.innerHTML = ''; // garante contêiner limpo
    host.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5).normalize();
    this.scene.add(directionalLight);
  }

  private onWindowResize(): void {
    if (!this.camera || !this.renderer) return;
    const host = this.hostRef.nativeElement;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width && height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  // ============ Caminhão ============
  private desenharCaminhao(): void {
    if (!this.scene) return;

    // remove mesh anterior do caminhão, se existir
    if (this.truckMesh) {
      this.scene.remove(this.truckMesh);
      (this.truckMesh.geometry as THREE.BufferGeometry)?.dispose?.();
      const mat: any = this.truckMesh.material;
      if (Array.isArray(mat)) mat.forEach(m => m.dispose?.());
      else mat?.dispose?.();
      this.truckMesh = undefined;
    }

    // Geometria do "container" (BackSide → desenha paredes por dentro)
    const geometry = new THREE.BoxGeometry(
      this.caminhao.largura,
      this.caminhao.altura,
      this.caminhao.comprimento
    );
    const material = new THREE.MeshPhongMaterial({ color: 0xbbbbbb, side: THREE.BackSide });

    const c = new THREE.Mesh(geometry, material);
    c.position.set(
      this.caminhao.largura / 2,
      this.caminhao.altura / 2,
      this.caminhao.comprimento / 2
    );

    this.scene.add(c);
    this.truckMesh = c;
  }

  // ============ Pacotes ============
  private criarPacotes(pacotes: ReadonlyArray<PacoteOtimo>): void {
    if (!this.scene) this.ensureInit();
    if (!this.scene) return;

    // limpa pacotes antigos
    this.clearBoxes();

    // Gera cores por chave "pedidoId|pacoteId"
    const chaves = [...new Set(pacotes.map(p => `${p.pedidoId}|${p.pacoteId}`))];
    chaves.forEach(chave => {
      if (!this.coresGeradas.has(chave)) {
        const cor = new THREE.Color(Math.random(), Math.random(), Math.random());
        this.coresGeradas.set(chave, cor);
      }
    });

    // Desenha caixas (X=largura, Y=altura, Z=comprimento)
    pacotes.forEach(pacote => {
      const geometry = new THREE.BoxGeometry(pacote.largura, pacote.altura, pacote.comprimento);

      const chaveCor = `${pacote.pedidoId}|${pacote.pacoteId}`;
      const corPacote = this.coresGeradas.get(chaveCor)!;

      const material = new THREE.MeshStandardMaterial({
        color: corPacote,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        pacote.x + pacote.largura / 2,
        pacote.y + pacote.altura / 2,
        pacote.z + pacote.comprimento / 2
      );

      this.scene!.add(mesh);
      this.boxes.push(mesh);
    });

    // Emite cores em hex para o componente pai
    const coresFormatadas = new Map<string, string>();
    this.coresGeradas.forEach((cor, chave) => {
      coresFormatadas.set(chave, `#${cor.getHexString()}`);
    });
    this.coresGeradasChange.emit(coresFormatadas);
  }

  private clearBoxes(): void {
    if (!this.scene) return;
    for (let i = this.boxes.length - 1; i >= 0; i--) {
      const box = this.boxes[i];
      this.scene.remove(box);
      (box.geometry as THREE.BufferGeometry)?.dispose?.();
      const mat: any = box.material;
      if (Array.isArray(mat)) mat.forEach(m => m.dispose?.());
      else mat?.dispose?.();
    }
    this.boxes = [];
  }

  // ============ Controles e render ============
  private setupControls(): void {
    if (!this.camera || !this.renderer) return;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  private animate(): void {
    const loop = () => {
      this.animationId = requestAnimationFrame(loop);
      this.controls?.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    loop();
  }
}
