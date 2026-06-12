import { useMemo } from 'react';

export const usePlayerPositions = (count) =>
  useMemo(() => {
    if (count === 0) return [];

    const positions = [];
    const startAngle = -90;

    for (let i = 0; i < count; i++) {
      const angleDeg = startAngle + (360 / count) * i;
      const angleRad = (angleDeg * Math.PI) / 180;

      const radiusX = 42;
      const radiusY = 38;
      const x = 50 + radiusX * Math.cos(angleRad);
      const y = 50 + radiusY * Math.sin(angleRad);

      positions.push({
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      });
    }

    return positions;
  }, [count]);
