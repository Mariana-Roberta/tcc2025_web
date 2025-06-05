import {Component, OnChanges, OnInit, ElementRef, ViewChild, Input} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap'

import { OtimizarService } from '../../services/otimizar.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-three-d-view',
  standalone: true,
  templateUrl: './three-d-view.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./three-d-view.component.css']
})
export class ThreeDViewComponent implements OnChanges {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  @Input() pacotesOtimizados: ReadonlyArray<{ x: number, y: number, z: number, comprimento: number, largura: number, altura: number, pacoteId: number }> = [];
  @Input() caminhao: { comprimento: number; largura: number; altura: number } = {
    comprimento: 0,
    largura: 0,
    altura: 0
  };
  @Input() loading: boolean | undefined;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private boxes: THREE.Mesh[] = [];
  private coresGeradas: Map<number, THREE.Color> = new Map();

  private readonly offset = 0.01;



  ngOnInit(): void {
    this.initThreeJS();
    this.criarCaminhao();
    this.setupControls();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
    setTimeout(() => this.onWindowResize(), 100);
  }

  ngOnChanges(): void {
    if (this.scene && this.pacotesOtimizados.length > 0) {
      this.criarPacotes(this.pacotesOtimizados);
    }
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(10.3, 6.7, 7.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5).normalize();
    this.scene.add(directionalLight);
  }

  private onWindowResize(): void {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width && height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  private criarCaminhao(): void {
    const geometry = new THREE.BoxGeometry(this.caminhao.largura, this.caminhao.altura, this.caminhao.comprimento);
    const material = new THREE.MeshPhongMaterial({ color: 0xbbbbbb, side: THREE.BackSide });
    const c = new THREE.Mesh(geometry, material);

    c.position.set(
      this.caminhao.largura / 2,
      this.caminhao.altura / 2,
      this.caminhao.comprimento / 2
    );

    this.scene.add(c);
  }

  private criarPacotes(pacotes: ReadonlyArray<{ x: number, y: number, z: number, comprimento: number, largura: number, altura: number, pacoteId: number }>): void {
    this.boxes.forEach(box => this.scene.remove(box));
    this.boxes = [];

    const coresUnicas = [...new Set(pacotes.map(p => p.pacoteId))];
    coresUnicas.forEach(cor => {
      if (!this.coresGeradas.has(cor)) {
        this.coresGeradas.set(cor, new THREE.Color(Math.random(), Math.random(), Math.random()));
      }
    });

    pacotes.forEach(pacote => {
      const geometry = new THREE.BoxGeometry(pacote.largura, pacote.altura, pacote.comprimento);

      const corPacote = this.coresGeradas.get(pacote.pacoteId) || new THREE.Color(Math.random(), Math.random(), Math.random());

      const material = new THREE.MeshStandardMaterial({
        color: corPacote,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
      });

      const boxMesh = new THREE.Mesh(geometry, material);

      boxMesh.position.set(
        pacote.x + pacote.largura / 2,
        pacote.y + pacote.altura / 2,
        pacote.z + pacote.comprimento / 2
      );

      this.scene.add(boxMesh);
      this.boxes.push(boxMesh);


    });
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
