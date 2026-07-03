export function initParticles() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return;
  }

  let canvas = document.querySelector(".particle-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.className = "particle-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  const particles = Array.from({ length: 28 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.2,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      if (particle.x < 0 || particle.x > window.innerWidth) {
        particle.dx *= -1;
      }
      if (particle.y < 0 || particle.y > window.innerHeight) {
        particle.dy *= -1;
      }
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${particle.alpha})`;
      ctx.fill();
    });
  };

  const tick = () => {
    draw();
    window.requestAnimationFrame(tick);
  };

  tick();
}
