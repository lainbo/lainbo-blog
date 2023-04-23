import React, { useEffect, useRef, useState } from "react";

const BranchingLines = () => {
  const canvasRef = useRef(null);
  const [mask, setMask] = useState("radial-gradient(circle, transparent, black);");

  useEffect(() => {
    const r180 = Math.PI;
    const r90 = Math.PI / 2;
    const r15 = Math.PI / 12;
    const color = "#88888825";
    const random = Math.random;
    let lastTime = performance.now();
    const interval = 1000 / 40;
    let animationId;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const size = { width: window.innerWidth, height: window.innerHeight };
      const dpr = window.devicePixelRatio || 1;

      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      canvas.width = dpr * size.width;
      canvas.height = dpr * size.height;
      ctx.scale(dpr, dpr);

      const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => {
        const dx = r * Math.cos(theta);
        const dy = r * Math.sin(theta);
        return [x + dx, y + dy];
      };

      const step = (x, y, rad) => {
        const length = random() * 6;

        const [nx, ny] = polar2cart(x, y, length, rad);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        const rad1 = rad + random() * r15;
        const rad2 = rad - random() * r15;

        if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
          return;

        steps.push(() => step(nx, ny, rad1));
        steps.push(() => step(nx, ny, rad2));
      };

      let steps = [];
      let prevSteps = [];

      const frame = () => {
        if (performance.now() - lastTime < interval) {
          animationId = requestAnimationFrame(frame);
          return;
        }

        prevSteps = steps;
        steps = [];
        lastTime = performance.now();

        if (!prevSteps.length) {
          cancelAnimationFrame(animationId);
        }
        prevSteps.forEach((i) => i());

        animationId = requestAnimationFrame(frame);
      };

      const start = () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        ctx.clearRect(0, 0, size.width, size.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        steps = [
          () => step(random() * size.width, 0, r90),
          () => step(random() * size.width, size.height, -r90),
          () => step(0, random() * size.height, 0),
          () => step(size.width, random() * size.height, r180),
        ];
        if (size.width < 500) {
          steps = steps.slice(0, 2);
        }
        animationId = requestAnimationFrame(frame);
      };

      start();
      window.addEventListener("resize", start);
      return () => {
        window.removeEventListener("resize", start);
        cancelAnimationFrame(animationId);
      };
    }
  }, [mask]);

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 pointer-events-none"
      style={{
        zIndex: -1,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <canvas ref={canvasRef} width="400" height="400" />
    </div>
  );
};

export default BranchingLines;

