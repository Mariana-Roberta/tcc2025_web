import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

@Component({
  selector: 'app-three-d-view',
  standalone: true,
  templateUrl: './three-d-view.component.html',
  styleUrls: ['./three-d-view.component.css']
})
export class ThreeDViewComponent implements OnInit {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private truck!: THREE.Mesh;
  private boxes: THREE.Mesh[] = [];
  private controls!: OrbitControls;
  // Tamanho do caminhão
  private truckSize: { width: number, height: number, depth: number } = { width: 10, height: 5, depth: 20 };

  // Dados das caixas (inicialmente vazio)
  private boxesData: { x: number, y: number, z: number, width: number, height: number, depth: number, endereco: number }[] = [];

  // Offset para considerar a expansão do papelão
  private offset: number = 0.01;

  // Mapa de cores para cada endereço
  private enderecoColors: Map<number, THREE.Color> = new Map();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initThreeJS();
    this.createTruck();
    this.addInitialBoxes(); // Adiciona caixas iniciais
    this.setupControls();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
    setTimeout(() => this.onWindowResize(), 100);
  }

  private onWindowResize(): void {
    const container = this.el.nativeElement.querySelector('#container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }


  private initThreeJS(): void {
    // Configuração da cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // Configuração da câmera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(10.3, 6.7, 7.5);
    this.camera.lookAt(0, 0, 0);

    if (typeof window !== 'undefined') {
      const container = this.containerRef.nativeElement;
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xeeeeee);

      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(10.3, 6.7, 7.5);
      this.camera.lookAt(0, 0, 0);
      this.camera.updateProjectionMatrix();

      // Adiciona luz ambiente
      const ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(ambientLight);

      // Adiciona luz direcional
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5).normalize();
      this.scene.add(directionalLight);
    }

  }
// Função para reduzir o tamanho das caixas apenas para o endereço 1
  reduzirCaixasDoEndereco1(): void {
    // Itera sobre as caixas e reduz o tamanho apenas se o endereço for 1
    this.boxes.forEach((boxMesh, index) => {
      const boxData = this.boxesData[index]; // Dados da caixa atual
      const endereco = boxData.endereco;

      // Verifica se o endereço da caixa é igual a 1
      if (endereco === 1) {
        // Reduz a caixa com base no endereço (modificando a escala, por exemplo)
        const scaleFactor = 0; // Fator de redução para o endereço 1 (80%)

        // Animação para redução da caixa (se você quiser usar animação)
        gsap.to(boxMesh.scale, {
          x: boxMesh.scale.x * scaleFactor,
          y: boxMesh.scale.y * scaleFactor,
          z: boxMesh.scale.z * scaleFactor,
          duration: 1, // Tempo de animação
          ease: "power2.out"
        });

        // Se não quiser animação, apenas altere o tamanho diretamente
        // boxMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
    });
  }

  private createTruck(): void {
    // Cria o caminhão com base no tamanho definido
    const truckGeometry = new THREE.BoxGeometry(
      this.truckSize.width,
      this.truckSize.height,
      this.truckSize.depth
    );
    const truckMaterial = new THREE.MeshPhongMaterial({ color: 0xbbbbbb, side: THREE.BackSide });
    this.truck = new THREE.Mesh(truckGeometry, truckMaterial);

    // Posiciona o caminhão a partir do ponto (0, 0, 0)
    this.truck.position.set(
      this.truckSize.width / 2,  // Ajusta a posição X para que o caminhão comece em 0
      this.truckSize.height / 2, // Ajusta a posição Y para que o caminhão comece em 0
      this.truckSize.depth / 2   // Ajusta a posição Z para que o caminhão comece em 0
    );

    this.scene.add(this.truck);
  }

  private addInitialBoxes(): void {
    this.boxesData = [
      { x: 0, y: 0, z: 0, width: 3, height: 2, depth: 2, endereco: 1 },
      { x: 2, y: 2, z: 2, width: 0.4, height: 2, depth: 2, endereco: 2 },
      { x: 1, y: 4, z: 1, width: 2, height: 2, depth: 2, endereco: 1 },
      { x: 0, y: 0, z: 4, width: 2, height: 3, depth: 1, endereco: 3 },
      { x: 7, y: 0, z: 0, width: 3, height: 2, depth: 2, endereco: 2 },
      { x: 0, y: 3, z: 0, width: 2, height: 1, depth: 3, endereco: 1 },
      { x: 5, y: 1, z: 5, width: 1, height: 4, depth: 1, endereco: 3 },
      { x: 8, y: 3, z: 2, width: 2, height: 2, depth: 4, endereco: 2 },
    ];
    this.createBoxes(this.boxesData);
  }

  private createBoxes(boxesData: { width: number, height: number, depth: number, endereco?: number }[]): void {
    this.boxes.forEach(box => this.scene.remove(box));
    this.boxes = [];

    const occupiedPositions: { x: number, y: number, z: number, width: number, height: number, depth: number }[] = [];

    boxesData.sort((a, b) => b.width * b.height * b.depth - a.width * a.height * a.depth); // Ordena por volume decrescente

    // Identifica os endereços únicos
    const enderecos = [...new Set(boxesData.map(box => box.endereco).filter(endereco => endereco !== undefined))];

    // Gera cores aleatórias para cada endereço
    enderecos.forEach(endereco => {
      this.enderecoColors.set(endereco, new THREE.Color(Math.random(), Math.random(), Math.random()));
    });

    boxesData.forEach(boxData => {
      const boxWidth = boxData.width;
      const boxHeight = boxData.height;
      const boxDepth = boxData.depth;
      const endereco = boxData.endereco;

      const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      // Carregar textura
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('/assets/textures/cardboard_texture.png', () => {
        console.log('Textura carregada com sucesso!');
      }, undefined, (error: any) => {
        console.error('Erro ao carregar textura:', error);
      });

      const materials = [
        new THREE.MeshStandardMaterial({ map: texture }),  // Front
        new THREE.MeshStandardMaterial({ map: texture }),  // Back
        new THREE.MeshStandardMaterial({ map: texture }), // Top face
        new THREE.MeshStandardMaterial({ map: texture }),  // Left
        new THREE.MeshStandardMaterial({ map: texture }),  // Right
        new THREE.MeshStandardMaterial({ map: texture }),  // Bottom
      ];
      const boxMesh = new THREE.Mesh(boxGeometry, materials);

      const position = this.findAvailablePosition(boxWidth, boxHeight, boxDepth, occupiedPositions);

      if (position) {
        boxMesh.position.set(
          position.x + boxWidth / 2,
          position.y + boxHeight / 2,
          position.z + boxDepth / 2
        );

        this.scene.add(boxMesh);
        this.boxes.push(boxMesh);

        occupiedPositions.push({ ...position, width: boxWidth, height: boxHeight, depth: boxDepth });

        // Animação de escala com GSAP
        gsap.fromTo(boxMesh.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.7)" }
        );

        // Adicionar etiqueta colorida
        if (endereco !== undefined) {
          this.addLabel(boxWidth, boxHeight, boxDepth, boxMesh, endereco);
        }
      } else {
        console.warn("Não foi possível encontrar uma posição para a caixa:", boxData);
      }
    });
  }

  private addLabel(width: number, height: number, depth: number, boxMesh: THREE.Mesh, endereco: number): void {
    const labelColor = this.enderecoColors.get(endereco) || new THREE.Color(0xffffff); // Cor padrão se não houver cor definida

    // Criar a geometria da etiqueta, usando largura e profundidade da caixa
    const labelGeometry = new THREE.PlaneGeometry(width * 0.4, depth * 0.4);

    // Criar o material da etiqueta
    const labelMaterial = new THREE.MeshBasicMaterial({ color: labelColor, side: THREE.DoubleSide });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

    // Posicionar a etiqueta sobre a face superior da caixa, em relação à posição da caixa
    labelMesh.position.set(
      0,  // Posição local na direção X, no centro da caixa
      height / 2 + 0.02,  // Colocar a etiqueta logo acima da face superior da caixa
      0  // Posição local na direção Z, no centro da caixa
    );

    // Garantir que a etiqueta esteja voltada para cima (alinhada com a face verde)
    labelMesh.rotation.x = Math.PI / 2; // Rotacionar a etiqueta para ficar visível na face superior

    // Adicionar a etiqueta como filho da caixa (boxMesh)
    boxMesh.add(labelMesh);
  }


  private findAvailablePosition(width: number, height: number, depth: number, occupiedPositions: { x: number, y: number, z: number, width: number, height: number, depth: number }[]): { x: number, y: number, z: number } | null {
    for (let z = 0; z + depth <= this.truckSize.depth; z += this.offset) {
      for (let y = 0; y + height <= this.truckSize.height; y += this.offset) {
        for (let x = 0; x + width <= this.truckSize.width; x += this.offset) {
          if (this.isPositionAvailable(x, y, z, width, height, depth, occupiedPositions)) {
            return { x, y, z };
          }
        }
      }
    }
    return null;
  }

  private isPositionAvailable(x: number, y: number, z: number, width: number, height: number, depth: number, occupiedPositions: { x: number, y: number, z: number, width: number, height: number, depth: number }[]): boolean {
    for (const existingBox of occupiedPositions) {
      if (
        x < existingBox.x + existingBox.width + this.offset &&
        x + width + this.offset > existingBox.x &&
        y < existingBox.y + existingBox.height + this.offset &&
        y + height + this.offset > existingBox.y &&
        z < existingBox.z + existingBox.depth + this.offset &&
        z + depth + this.offset > existingBox.z
      ) {
        return false;
      }
    }
    return true;
  }

  private setupControls(): void {
    // Configuração do OrbitControls (rotacionar e zoom)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Suaviza o movimento
    this.controls.dampingFactor = 0.05;
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Atualiza os controles
    this.controls.update();

    // Renderiza a cena
    this.renderer.render(this.scene, this.camera);
  }
}
