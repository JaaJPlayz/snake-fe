import styles from "./App.module.css";
import { useState, useEffect, useRef } from "react";

function App() {
	const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	const [snakePosition, setSnakePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	const [snakeBody, setSnakeBody] = useState<{ x: number; y: number }[]>([]);

	// const bodySegmentDistance = 10;
	const maxSegments = 10;
	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setCursorPosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	const updateSnakePosition = () => {
		setSnakePosition((prev) => {
			const deltaX = cursorPosition.x - prev.x;
			const deltaY = cursorPosition.y - prev.y;

			const speed = 0.1;
			const newX = prev.x + deltaX * speed;
			const newY = prev.y + deltaY * speed;

			return { x: newX, y: newY };
		});
	};

	useEffect(() => {
		const animate = () => {
			updateSnakePosition();

			const newBody = [{ x: snakePosition.x, y: snakePosition.y }];

			if (snakeBody.length > 0) {
				for (let i = 0; i < snakeBody.length; i++) {
					const segment = snakeBody[i];
					const target = newBody[i] || { x: snakePosition.x, y: snakePosition.y };
					newBody.push({
						x: segment.x + (target.x - segment.x) * 0.1,
						y: segment.y + (target.y - segment.y) * 0.1,
					});
				}
			}

			if (newBody.length > maxSegments) {
				newBody.splice(0, newBody.length - maxSegments);
			}

			setSnakeBody(newBody);
			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [snakePosition]);

	useEffect(() => {
		snakeBody.forEach((segment, index) => {
			const bodyPart = document.querySelector(`.${styles["snake-body"]}:nth-of-type(${index + 1})`);
			if (bodyPart) {
				bodyPart.style.transform = `translate(${segment.x - 7.5}px, ${segment.y - 7.5}px)`;
			}
		});
	}, [snakeBody]);

	return (
		<div className={styles["App"]}>
			{snakeBody.map((_, i) => (
				<div key={i} className={styles["snake-body"]}></div>
			))}
		</div>
	);
}

export default App;

