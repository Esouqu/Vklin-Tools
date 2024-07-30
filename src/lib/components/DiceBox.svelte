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
		WebGLRenderer
	} from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { randInt } from 'three/src/math/MathUtils.js';
	import diceRollFile from '$lib/assets/sounds/dice_roll_sound.mp3';
	import { loadAudio, playSound } from '$lib/utils';

	interface Props {
		value: number;
		geometry: BufferGeometry;
		color: string;
	}

	const { value, geometry, color }: Props = $props();

	let webGl: HTMLCanvasElement | undefined = $state();
	let isRolling = $state(false);
	let resultN = $state(0);
	let width = 200;
	let height = 200;
	let aspectRatio = $derived(width / height);

	let rollSound: HTMLAudioElement;

	let camera: PerspectiveCamera;
	let renderer: WebGLRenderer;
	let scene: Scene;
	let mesh: Mesh;
	let controls: OrbitControls;
	let mainLight: DirectionalLight;

	onMount(() => {
		rollSound = loadAudio(diceRollFile);
		setCanvas();
		animate();
	});

	$effect(() => {
		if (geometry) {
			mesh.geometry = geometry;
			geometry.rotateX(60);
			geometry.rotateZ(45);
			resultN = 0;
			animateMesh();
		}
	});

	$effect(() => {
		if (aspectRatio) {
			updateCamera();
			updateRenderer();
		}

		return () => {
			if (renderer) {
				renderer.dispose();
			}
			if (camera) {
				camera.remove();
			}
			if (scene) {
				scene.clear();
			}
		};
	});

	$effect(() => {
		if (color && mesh.material) {
			mesh.material = new MeshPhongMaterial({
				color: new Color(color)
			});
		}
	});

	function setCanvas() {
		if (!webGl) return;

		scene = new Scene();
		mainLight = new DirectionalLight('white', 2);
		mainLight.position.z = 15;

		geometry.rotateX(60);
		geometry.rotateZ(45);

		mesh = new Mesh(
			geometry,
			new MeshPhongMaterial({
				color: new Color(color)
			})
		);

		scene.add(mesh);
		animateMesh();

		camera = new PerspectiveCamera(45, aspectRatio, 0.1, 100);
		camera.position.z = 3; // camera zoom
		camera.add(mainLight);
		scene.add(camera);

		const canvas = webGl;
		renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(width, height);
		renderer.render(scene, camera);

		controls = new OrbitControls(camera, canvas);
		controls.enablePan = false;
		controls.enableDamping = false;
		controls.enableZoom = false;

		camera.lookAt(mesh.position);
	}

	function updateCamera() {
		camera.aspect = aspectRatio;
		camera.updateProjectionMatrix();
	}

	function animateMesh() {
		let animationFrameId = requestAnimationFrame(() => animateAppearance());
		mesh.scale.set(0, 0, 0);

		function animateAppearance() {
			const speed = 0.1; // Adjust this value to control the animation speed

			const scaleX = Math.min(1, mesh.scale.x + speed);
			const scaleY = Math.min(1, mesh.scale.y + speed);
			const scaleZ = Math.min(1, mesh.scale.z + speed);

			mesh.scale.set(scaleX, scaleY, scaleZ);

			if (mesh.scale.x >= 1) {
				cancelAnimationFrame(animationFrameId);
				return;
			}

			animationFrameId = requestAnimationFrame(animateAppearance);
		}
	}

	function updateRenderer() {
		renderer.setSize(width, height);
		renderer.render(scene, camera);
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	function animate() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	function throwDice() {
		if (isRolling) return;

		let animationFrameId = requestAnimationFrame(() => animateThrow());

		playSound(rollSound, 0.2);
		isRolling = true;

		function animateThrow() {
			const time = Date.now() * 0.01;
			const rotationSpeed = 3 * (1 + Math.sin(time));

			mesh.rotation.y = rotationSpeed;
			mesh.rotation.z = rotationSpeed;

			if (!isRolling) {
				cancelAnimationFrame(animationFrameId);
				return;
			}

			animationFrameId = requestAnimationFrame(animateThrow);
		}

		setTimeout(() => {
			cancelAnimationFrame(animationFrameId);
			isRolling = false;
			const result = randInt(1, value);
			resultN = result;
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
	{#if resultN && !isRolling}
		<div class="dice-box-result">
			{resultN}
		</div>
	{/if}
	<canvas bind:this={webGl} {width} {height} onmouseup={throwDice}></canvas>
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
