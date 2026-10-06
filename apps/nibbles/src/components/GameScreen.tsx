import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FitBox } from '@funzone/ui';
import { GRID_H, GRID_W, NibblesGame, type Dir, type Status } from '../game/engine';
import { useHighscore } from '../hooks/useHighscore';
import { PauseIcon } from './icons';

interface Hud {
  score: number;
  level: number;
  lives: number;
  status: Status;
}

const KEY_DIR: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
};

export function GameScreen() {
  const { t } = useTranslation();
  const { best, submit } = useHighscore();

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<NibblesGame | null>(null);
  const cellRef = useRef(16);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const handledOverRef = useRef(false);

  const [hud, setHud] = useState<Hud>({ score: 0, level: 0, lives: 3, status: 'menu' });
  const [newRecord, setNewRecord] = useState(false);

  // Save the high score when the game ends (only once per game).
  useEffect(() => {
    if (hud.status === 'gameover') {
      if (!handledOverRef.current) {
        handledOverRef.current = true;
        setNewRecord(submit(hud.score));
      }
    } else {
      handledOverRef.current = false;
      if (hud.status === 'playing') setNewRecord(false);
    }
  }, [hud.status, hud.score, submit]);

  useEffect(() => {
    const game = new NibblesGame();
    gameRef.current = game;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const wrap = wrapRef.current!;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      const cell = Math.max(6, Math.floor(Math.min(w / GRID_W, h / GRID_H)));
      cellRef.current = cell;
      canvas.style.width = `${cell * GRID_W}px`;
      canvas.style.height = `${cell * GRID_H}px`;
      canvas.width = cell * GRID_W * dpr;
      canvas.height = cell * GRID_H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);

    const draw = () => {
      const cell = cellRef.current;
      ctx.fillStyle = '#0d160d';
      ctx.fillRect(0, 0, GRID_W * cell, GRID_H * cell);

      ctx.fillStyle = '#166534';
      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          if (game.walls[y][x]) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }

      const f = game.food;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(f.x * cell + cell / 2, f.y * cell + cell / 2, cell * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0f0a';
      ctx.font = `bold ${Math.floor(cell * 0.7)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(f.value), f.x * cell + cell / 2, f.y * cell + cell / 2 + 1);

      game.snake.forEach((c, i) => {
        ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
        ctx.fillRect(c.x * cell + 1, c.y * cell + 1, cell - 2, cell - 2);
      });
    };

    let raf = 0;
    let lastTs = 0;
    let acc = 0;
    const loop = (ts: number) => {
      if (!lastTs) lastTs = ts;
      acc += ts - lastTs;
      lastTs = ts;
      const speed = game.speedMs;
      let guard = 0;
      while (acc >= speed && guard < 5) {
        game.step();
        acc -= speed;
        guard += 1;
        if (game.status !== 'playing') {
          acc = 0;
          break;
        }
      }
      if (game.status !== 'playing') acc = 0;
      draw();
      setHud((prev) =>
        prev.score === game.score &&
        prev.level === game.level &&
        prev.lives === game.lives &&
        prev.status === game.status
          ? prev
          : { score: game.score, level: game.level, lives: game.lives, status: game.status },
      );
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const primaryAction = () => {
      if (game.status === 'menu' || game.status === 'gameover') game.start();
      else if (game.status === 'paused' || game.status === 'crashed') game.resume();
    };

    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_DIR[e.key];
      if (dir) {
        e.preventDefault();
        game.setDirection(dir);
        return;
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        if (game.status === 'playing') game.pause();
        else if (game.status === 'paused') game.resume();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        primaryAction();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const primaryAction = () => {
    const g = gameRef.current;
    if (!g) return;
    if (g.status === 'menu' || g.status === 'gameover') g.start();
    else if (g.status === 'paused' || g.status === 'crashed') g.resume();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const tch = e.touches[0];
    touchRef.current = { x: tch.clientX, y: tch.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const g = gameRef.current;
    const start = touchRef.current;
    if (!g || !start) return;
    const tch = e.changedTouches[0];
    const dx = tch.clientX - start.x;
    const dy = tch.clientY - start.y;
    if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
      if (g.status !== 'playing') primaryAction();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) g.setDirection(dx > 0 ? 'right' : 'left');
    else g.setDirection(dy > 0 ? 'down' : 'up');
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-2 p-2 landscape:h-full landscape:max-w-[80dvh]">
      {/* HUD */}
      <div className="flex flex-none items-start justify-between px-1 text-sm">
        <div className="flex flex-col leading-tight">
          <span>
            {t('hud.score')}: <b className="text-green-300">{hud.score}</b>
          </span>
          <span className="text-xs text-neutral-400">
            {t('hud.best')}: <b className="text-green-300">{best}</b>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-300">
            {t('hud.level')} <b className="text-green-300">{hud.level + 1}</b>
          </span>
          <span aria-label="lives">{'❤'.repeat(Math.max(0, hud.lives)) || '—'}</span>
          {(hud.status === 'playing' || hud.status === 'paused') && (
            <button
              type="button"
              onClick={() => {
                const g = gameRef.current;
                if (!g) return;
                if (g.status === 'playing') g.pause();
                else g.resume();
              }}
              aria-label={t('a11y.pause')}
              className="rounded-md p-1 text-neutral-200 transition-colors hover:bg-white/10"
            >
              <PauseIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <FitBox ratio={GRID_W / GRID_H}>
        <div ref={wrapRef} className="relative flex h-full w-full items-center justify-center">
          <canvas
          ref={canvasRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="block touch-none rounded-lg border border-green-900/60"
        />

        {hud.status !== 'playing' && (
          <div
            onClick={primaryAction}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70 p-6 text-center"
          >
            {hud.status === 'menu' && (
              <>
                <h1 className="text-4xl font-bold tracking-wide text-green-400">Nibbles</h1>
                <p className="max-w-xs text-sm text-neutral-300">{t('overlay.intro')}</p>
                <p className="text-xs text-neutral-400">{t('overlay.controls')}</p>
                {best > 0 && (
                  <p className="text-sm text-neutral-300">
                    {t('hud.best')}: <b className="text-green-300">{best}</b>
                  </p>
                )}
              </>
            )}
            {hud.status === 'crashed' && (
              <>
                <h2 className="text-3xl font-bold text-amber-400">{t('overlay.crashed')}</h2>
                <p className="text-sm text-neutral-200">{t('overlay.livesLeft', { n: hud.lives })}</p>
              </>
            )}
            {hud.status === 'paused' && (
              <h2 className="text-3xl font-bold text-green-400">{t('overlay.paused')}</h2>
            )}
            {hud.status === 'gameover' && (
              <>
                <h2 className="text-3xl font-bold text-rose-400">{t('overlay.gameOver')}</h2>
                {newRecord && <p className="text-lg font-semibold text-amber-400">{t('overlay.newRecord')}</p>}
                <p className="text-lg">
                  {t('overlay.finalScore')}: <b className="text-green-300">{hud.score}</b>
                </p>
                <p className="text-sm text-neutral-300">
                  {t('hud.best')}: <b className="text-green-300">{best}</b>
                </p>
              </>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                primaryAction();
              }}
              className="mt-2 rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-500"
            >
              {hud.status === 'menu'
                ? t('overlay.tapStart')
                : hud.status === 'gameover'
                  ? t('overlay.playAgain')
                  : t('overlay.continue')}
            </button>
          </div>
        )}
        </div>
      </FitBox>
    </div>
  );
}
