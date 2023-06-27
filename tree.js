    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    let pendingTasks = [];

    const getEndPoint = (b) => {
      return {
        x: b.start.x + b.length * Math.cos(b.theta),
        y: b.start.y + b.length * Math.sin(b.theta),
      }
    }

    const lineTo = (p1, p2) => {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    const drawBranch = (b) => {
      lineTo(b.start, getEndPoint(b));
    }

    const step = (b, depth = 0) => {
      const end = getEndPoint(b);
      drawBranch(b);

      if (depth < 4 || Math.random() < 0.5) {
        pendingTasks.push(() => step({
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta - 0.2 * Math.random(),
        }, depth + 1))
      }
      if (depth < 4 || Math.random() < 0.5) {
        pendingTasks.push(() => step({
          start: end,
          length: b.length + (Math.random() * 2 - 1),
          theta: b.theta + 0.2 * Math.random(),
        }, depth + 1))
      }
    }

    const frame = () => {
      const tasks = [];
      pendingTasks = pendingTasks.filter((i) => {
        if (Math.random() > 0.4) {
          tasks.push(i);
          return false;
        }
        return true;
      })
      tasks.forEach(fn => fn());
    }

    let framesCount = 0;
    const startFrame = () => {
      requestAnimationFrame(() => {
        framesCount += 1;
        if (framesCount % 3 === 0)
          frame();
        startFrame();
      });
    }

    const init = () => {
      ctx.strokeStyle = '#000';

      const numTrees = 5;
      for (let i = 0; i < numTrees; i++) {
        // Generate a random point on the border.
        let x, y, theta;
        const border = Math.floor(Math.random() * 4);
        switch (border) {
          case 0: // Top border.
            x = Math.random() * canvas.width;
            y = 0;
            theta = (Math.random() * Math.PI / 2) + Math.PI / 4; // Point downwards.
            break;
          case 1: // Right border.
            x = canvas.width;
            y = Math.random() * canvas.height;
            theta = (Math.random() * Math.PI / 2) + Math.PI * 3 / 4; // Point leftwards.
            break;
          case 2: // Bottom border.
            x = Math.random() * canvas.width;
            y = canvas.height;
            theta = (Math.random() * Math.PI / 2) + Math.PI * 5 / 4; // Point upwards.
            break;
          case 3: // Left border.
          default:
            x = 0;
            y = Math.random() * canvas.height;
            theta = (Math.random() * Math.PI / 2) + Math.PI * 7 / 4; // Point rightwards.
            break;
        }
        step({
          start: { x, y },
          length: 10,
          theta,
        });
      }
    }

    window.onload = function() {
      init();
      startFrame();
    }