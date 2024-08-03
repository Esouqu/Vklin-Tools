<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BufferGeometry,
		Color,
		DirectionalLight,
		Mesh,
		MeshPhongMaterial,
		PerspectiveCamera,
		Scene,
		Vector3,
		WebGLRenderer
	} from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { randInt } from 'three/src/math/MathUtils.js';
	import diceRollFile from '$lib/assets/sounds/dice_roll_sound.mp3';
	import { loadAudio, playSound } from '$lib/utils';
	import anime from 'animejs';

	interface Props {
		value: number;
		diceGeometry: BufferGeometry;
		color: string;
		onRollStart?: () => void;
		onRollEnd?: () => void;
	}

	const { value, diceGeometry, color, onRollStart, onRollEnd }: Props = $props();

	let webGl: HTMLCanvasElement | undefined = $state();
	let isRolling = $state(false);
	let rolledResult: number | undefined = $state(0);
	let width = 200;
	let height = 200;
	let aspectRatio = $derived(width / height);

	let camera: PerspectiveCamera = new PerspectiveCamera();
	let renderer: WebGLRenderer;
	let scene: Scene;
	let mesh: Mesh<BufferGeometry, MeshPhongMaterial>;
	let controls: OrbitControls;
	let mainLight: DirectionalLight;

	let rollSound: HTMLAudioElement;
	let throwAnimationId: number;
	let inflateAnimationId: number;

	onMount(() => {
		rollSound = loadAudio(diceRollFile);
		setupCanvas();
		animateControls();

		return () => {
			renderer.dispose();
			camera.remove();
			scene.clear();
			controls.dispose();
			mainLight.dispose();
		};
	});

	$effect(() => {
		if (diceGeometry) {
			rolledResult = 0;

			setMeshGeometry(diceGeometry);
			inflateMesh();
		}
	});

	$effect(() => {
		if (aspectRatio) {
			updateCamera();
			updateRenderer();
		}
	});

	$effect(() => {
		if (color && mesh.material) {
			const nextColor = new Color(color);

			anime({
				targets: mesh.material.color,
				r: nextColor.r,
				g: nextColor.g,
				b: nextColor.b,
				duration: 500,
				easing: 'easeInOutQuad'
			});
		}
	});

	function setupCanvas() {
		if (!webGl) return;

		scene = new Scene();

		mesh = createMesh();
		mainLight = createLight();
		camera = createCamera();
		camera.add(mainLight);
		camera.lookAt(mesh.position);

		scene.add(mesh);
		scene.add(camera);

		renderer = createRenderer(webGl);
		controls = createControls(webGl);

		inflateMesh();
	}

	function createControls(canvas: HTMLCanvasElement) {
		const controlsInstance = new OrbitControls(camera, canvas);
		controlsInstance.enablePan = false;
		controlsInstance.enableDamping = true;
		controlsInstance.dampingFactor = 0.03;
		controlsInstance.rotateSpeed = 0.5;

		return controlsInstance;
	}

	function createRenderer(canvas: HTMLCanvasElement) {
		const rendererInstance = new WebGLRenderer({ canvas, antialias: true, alpha: true });
		rendererInstance.setClearColor(0x000000, 0);
		rendererInstance.setSize(width, height);
		rendererInstance.render(scene, camera);

		return rendererInstance;
	}

	function createLight() {
		const lightInstance = new DirectionalLight('white', 2);
		lightInstance.position.z = 15;

		return lightInstance;
	}

	function setMeshGeometry(geometry: BufferGeometry) {
		mesh.geometry = geometry;
		mesh.geometry.rotateX(60);
		mesh.geometry.rotateZ(45);
	}

	function createMesh() {
		const meshInstance = new Mesh(
			diceGeometry,
			new MeshPhongMaterial({
				color: new Color(color)
			})
		);

		return meshInstance;
	}

	function createCamera() {
		const cameraInstance = new PerspectiveCamera(45, aspectRatio, 0.1, 100);
		cameraInstance.position.z = 3; // camera zoom

		return cameraInstance;
	}

	function updateCamera() {
		camera.aspect = aspectRatio;
		camera.updateProjectionMatrix();
	}

	function updateRenderer() {
		renderer.setSize(width, height);
		renderer.render(scene, camera);
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	function animateControls() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(animateControls);
	}

	function animateAppearance() {
		const speed = 0.1; // Adjust this value to control the animation speed

		const scaleX = Math.min(1, mesh.scale.x + speed);
		const scaleY = Math.min(1, mesh.scale.y + speed);
		const scaleZ = Math.min(1, mesh.scale.z + speed);

		mesh.scale.set(scaleX, scaleY, scaleZ);

		if (mesh.scale.x >= 1) {
			cancelAnimationFrame(inflateAnimationId);
			return;
		}

		inflateAnimationId = requestAnimationFrame(animateAppearance);
	}

	function inflateMesh() {
		mesh.scale.set(0, 0, 0);
		inflateAnimationId = requestAnimationFrame(() => animateAppearance());
	}

	function animateThrow() {
		const xRotation = Math.random() * Math.PI * 2;
		const yRotation = Math.random() * Math.PI * 2;
		const zRotation = Math.random() * Math.PI * 2;

		mesh.rotation.set(xRotation, yRotation, zRotation);

		if (!isRolling) {
			cancelAnimationFrame(throwAnimationId);
			return;
		}

		throwAnimationId = requestAnimationFrame(animateThrow);
	}

	function throwDice() {
		if (isRolling) return;

		playSound(rollSound, 0.2);
		isRolling = true;
		onRollStart?.();

		throwAnimationId = requestAnimationFrame(() => animateThrow());

		setTimeout(() => {
			cancelAnimationFrame(throwAnimationId);

			anime({
				targets: mesh.rotation,
				x: mesh.rotation.x + 0.25,
				y: mesh.rotation.y + 0.25,
				z: mesh.rotation.z + 0.25,
				duration: 700,
				easing: 'easeOutQuad'
			});

			controls.reset();
			rolledResult = randInt(1, value);
			isRolling = false;

			onRollEnd?.();
		}, 700);
	}
</script>

<svelte:document
	onkeydown={(e) => {
		if (e.code === 'KeyZ') {
			throwDice();
		}
	}}
/>

<div class="dice-box">
	{#if rolledResult && !isRolling}
		<div class="dice-box-result">
			{rolledResult}
		</div>
	{/if}
	<canvas
		bind:this={webGl}
		{width}
		{height}
		onmousedown={() => (rolledResult = undefined)}
		onmouseup={throwDice}
	></canvas>
</div>

<style lang="scss">
	.dice-box {
		position: relative;
		display: flex;

		&-result {
			position: absolute;
			top: 50%;
			left: 50%;
			z-index: 999;
			transform-origin: top center;
			transform: translate(-50%, -50%);
			font-weight: 600;
			font-size: 36px;
			text-shadow: 0 0 5px black;
			color: white;
			pointer-events: none;
			user-select: none;
		}

		& canvas {
			border-radius: 50%;
			background-color: transparent;
			transition: 0.2s;
			user-select: none;
			cursor: pointer;

			&:hover {
				background-color: var(--hover-white);
			}
		}
	}
</style>
