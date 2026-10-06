import { describe, expect, it } from 'vitest';
import { NibblesGame } from './engine';

/** Deterministic RNG that cycles through a sequence. */
function seq(values: number[]) {
  let i = 0;
  return () => values[i++ % values.length];
}

describe('NibblesGame', () => {
  it('starts in the menu, then in game with a 3-cell snake', () => {
    const g = new NibblesGame(seq([0.5, 0.5]));
    expect(g.status).toBe('menu');
    g.start();
    expect(g.status).toBe('playing');
    expect(g.snake).toHaveLength(3);
    expect(g.lives).toBe(3);
    expect(g.level).toBe(0);
  });

  it('cannot turn back into its own tail', () => {
    const g = new NibblesGame(seq([0.5, 0.5])); // food at (10,13), far away
    g.start();
    g.setDirection('left'); // opposite of right -> ignored
    g.step();
    expect(g.snake[0]).toEqual({ x: 5, y: 2 }); // still moved right
  });

  it('eating grows the snake and adds score', () => {
    // constructor consumes the first pair; start() puts food at (5,2); eat -> (10,10)
    const g = new NibblesGame(seq([0.5, 0.5, 0.25, 0.08, 0.49, 0.38]));
    g.start();
    expect(g.food).toEqual({ x: 5, y: 2, value: 1 });
    g.step();
    expect(g.snake[0]).toEqual({ x: 5, y: 2 });
    expect(g.snake).toHaveLength(4);
    expect(g.score).toBe(1);
  });

  it('hitting a wall costs a life, resets the position to start', () => {
    const g = new NibblesGame(seq([0.49, 0.38])); // food at (10,10)
    g.start();
    g.setDirection('up');
    g.step(); // (4,1)
    g.step(); // (4,0) = wall -> crash
    expect(g.lives).toBe(2);
    expect(g.status).toBe('crashed');
    expect(g.snake[0]).toEqual({ x: 4, y: 2 }); // position resets to start
    expect(g.snake).toHaveLength(3);

    g.resume();
    expect(g.status).toBe('playing');
  });

  it('after a crash it reappears small but grows back to the previous length', () => {
    const g = new NibblesGame(seq([0.5, 0.5, 0.25, 0.08, 0.49, 0.38]));
    g.start();
    g.step(); // eats at (5,2) -> length 4
    expect(g.snake).toHaveLength(4);
    g.setDirection('up');
    g.step(); // (5,1)
    g.step(); // (5,0) wall -> crash: reset to 3 + pending growth
    expect(g.status).toBe('crashed');
    expect(g.snake).toHaveLength(3);

    g.resume();
    g.step(); // grows back (does not cut the tail)
    expect(g.snake).toHaveLength(4);
  });
});
