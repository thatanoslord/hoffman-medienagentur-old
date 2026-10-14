    document.addEventListener("DOMContentLoaded", () => {
      const navBar = document.getElementById("navBar");
      const servicesItem = document.querySelector(".nav-item--services");
      const servicesTrigger = servicesItem?.querySelector(".nav-trigger");

      if (navBar) {
        const regularNavItems = navBar.querySelectorAll(
          ".nav-item:not(.nav-item--services)"
        );

        regularNavItems.forEach((item) => {
          item.addEventListener("click", () => {
            regularNavItems.forEach((link) => {
              link.classList.remove("active");

              const oldLamp = link.querySelector(".lamp");
              if (oldLamp) oldLamp.remove();
            });

            item.classList.add("active");

            const lamp = document.createElement("span");
            lamp.className = "lamp";
            lamp.innerHTML = `
            <span class="lamp-top">
              <span class="glow glow-1"></span>
              <span class="glow glow-2"></span>
              <span class="glow glow-3"></span>
            </span>
          `;

            item.appendChild(lamp);
          });
        });
      }

      if (!servicesItem || !servicesTrigger) return;

      function closeServicesMenu() {
        servicesItem.classList.remove("is-open");
        servicesTrigger.setAttribute("aria-expanded", "false");
      }

      servicesTrigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const shouldOpen = !servicesItem.classList.contains("is-open");

        servicesItem.classList.toggle("is-open", shouldOpen);
        servicesTrigger.setAttribute("aria-expanded", String(shouldOpen));
      });

      document.addEventListener("click", (event) => {
        if (!servicesItem.contains(event.target)) {
          closeServicesMenu();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeServicesMenu();
          servicesTrigger.focus();
        }
      });
    });
  

    // const navBar = document.getElementById("navBar");
    // const navItems = navBar.querySelectorAll(".nav-item");

    // navItems.forEach((item) => {
    //   item.addEventListener("click", () => {
    //     navItems.forEach((link) => {
    //       link.classList.remove("active");
    //       const oldLamp = link.querySelector(".lamp");
    //       if (oldLamp) oldLamp.remove();
    //     });

    //     item.classList.add("active");

    //     const lamp = document.createElement("span");
    //     lamp.className = "lamp";
    //     lamp.innerHTML = `
    //     <span class="lamp-top">
    //       <span class="glow glow-1"></span>
    //       <span class="glow glow-2"></span>
    //       <span class="glow glow-3"></span>
    //     </span>
    //   `;
    //     item.appendChild(lamp);
    //   });
    // });


    //   hero section

    (function () {
      const root = document.getElementById("verdant-swirl-1");
      if (!root) return;

      const canvas = root.querySelector(".verdant-swirl-canvas");
      if (!canvas) return;

      const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

      const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return palette(0.5 + 0.5 * sin(q.x + q.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;

  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }

  p += u_offset;

  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));

  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }

  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }

  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;

  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }

  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);

  if (abs(u_brightness) > 0.0001)
    col += u_brightness;

  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }

  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;

  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

      const UNIFORMS = {
        colors: [
          [0.141, 0.153, 0.659], // #2427A8
          [0.231, 0.169, 0.776], // #3B2BC6
          [0.369, 0.133, 0.788], // #5E22C9
          [0.545, 0.122, 0.831], // #8B1FD4
          [0.769, 0.090, 0.843], // #C417D7
          [0.914, 0.000, 0.831], // #E900D4
          [0.914, 0.000, 0.831],
          [0.914, 0.000, 0.831]
        ],
        colorCount: 6,
        scale: 1.280,
        intensity: 0.470,
        paramA: 0.500,
        warp: 0.000,
        detail: 2.400,
        contrast: 0.920,
        brightness: 0.000,
        saturation: 1.000,
        hue: 0.0000,
        vignette: 0.000,
        blur: 0.0000,
        grain: 0.010,
        seed: 707.0,
        rotate: 0.0000,
        offsetX: 0.000,
        offsetY: 0.000,
        drift: 0.000,
        cursorEnabled: false,
        cursorEffect: 2.0,
        cursorStrength: 0.650,
        cursorRadius: 0.460,
        oklab: 0.0,
        timeScale: 0.841
      };

      const gl = canvas.getContext("webgl", { antialias: false });
      if (!gl) return;

      function compile(type, src) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
      }

      const program = gl.createProgram();
      const vertexShader = compile(gl.VERTEX_SHADER, VERT);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.useProgram(program);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );

      const loc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uni = {
        colors: gl.getUniformLocation(program, "u_colors"),
        scene: gl.getUniformLocation(program, "u_scene"),
        shape: gl.getUniformLocation(program, "u_shape"),
        surface: gl.getUniformLocation(program, "u_surface"),
        finish: gl.getUniformLocation(program, "u_finish"),
        transform: gl.getUniformLocation(program, "u_transform"),
        space: gl.getUniformLocation(program, "u_space"),
        cursor: gl.getUniformLocation(program, "u_cursor")
      };

      gl.uniform3fv(uni.colors, new Float32Array(UNIFORMS.colors.flat()));
      gl.uniform4f(uni.shape, UNIFORMS.scale, UNIFORMS.intensity, UNIFORMS.paramA, UNIFORMS.warp);
      gl.uniform4f(uni.surface, UNIFORMS.detail, UNIFORMS.contrast, UNIFORMS.brightness, UNIFORMS.saturation);
      gl.uniform4f(uni.finish, UNIFORMS.hue, UNIFORMS.vignette, UNIFORMS.blur, UNIFORMS.grain);
      gl.uniform4f(uni.transform, UNIFORMS.seed, UNIFORMS.rotate, UNIFORMS.drift, UNIFORMS.oklab);
      gl.uniform4f(uni.cursor, 0, UNIFORMS.cursorEffect, UNIFORMS.cursorStrength, UNIFORMS.cursorRadius);

      let bounds = root.getBoundingClientRect();
      let raf = 0;
      let lastNow = null;
      let visible = document.visibilityState === "visible";
      let inView = true;
      const start = performance.now();
      const timeAnimated = Math.abs(UNIFORMS.timeScale) > 0.0001;

      let targetX = 0;
      let targetY = 0;
      let targetPresence = 0;
      let mouseX = 0;
      let mouseY = 0;
      let cursorPresence = 0;
      let pointerKnown = false;
      let pointerClientX = 0;
      let pointerClientY = 0;

      function resizeCanvas() {
        bounds = root.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rawWidth = Math.max(1, Math.round(bounds.width * dpr));
        const rawHeight = Math.max(1, Math.round(bounds.height * dpr));
        const pixelScale = Math.min(1, Math.sqrt(2000000 / Math.max(1, rawWidth * rawHeight)));
        const width = Math.max(1, Math.round(rawWidth * pixelScale));
        const height = Math.max(1, Math.round(rawHeight * pixelScale));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }

      function requestRender() {
        if (!raf && visible && inView) {
          raf = requestAnimationFrame(render);
        }
      }

      function updatePointerTarget() {
        if (!UNIFORMS.cursorEnabled || !pointerKnown) return;
        if (!bounds.width || !bounds.height) return;

        const inside =
          pointerClientX >= bounds.left &&
          pointerClientX <= bounds.right &&
          pointerClientY >= bounds.top &&
          pointerClientY <= bounds.bottom;

        if (!inside) {
          targetPresence = 0;
          requestRender();
          return;
        }

        const nextX = ((pointerClientX - bounds.left) / bounds.width) * 2 - 1;
        const nextY = -(((pointerClientY - bounds.top) / bounds.height) * 2 - 1);

        if (targetPresence === 0 && cursorPresence < 0.01) {
          mouseX = nextX;
          mouseY = nextY;
        }

        targetX = nextX;
        targetY = nextY;
        targetPresence = 1;
        requestRender();
      }

      function onPointerMove(event) {
        pointerKnown = true;
        pointerClientX = event.clientX;
        pointerClientY = event.clientY;
        updatePointerTarget();
      }

      function onPointerLeave() {
        pointerKnown = false;
        targetPresence = 0;
        requestRender();
      }

      function render(now) {
        raf = 0;
        if (!visible || !inView) return;

        const dt = lastNow === null ? 0 : Math.min((now - lastNow) / 1000, 0.1);
        lastNow = now;

        const follow = 1 - Math.exp(-12 * dt);
        mouseX += (targetX - mouseX) * follow;
        mouseY += (targetY - mouseY) * follow;
        cursorPresence += (targetPresence - cursorPresence) * follow;

        resizeCanvas();

        gl.uniform4f(
          uni.scene,
          canvas.width,
          canvas.height,
          ((now - start) / 1000) * UNIFORMS.timeScale,
          UNIFORMS.colorCount
        );

        gl.uniform4f(
          uni.space,
          UNIFORMS.offsetX,
          UNIFORMS.offsetY,
          mouseX,
          mouseY
        );

        gl.uniform4f(
          uni.cursor,
          UNIFORMS.cursorEnabled ? cursorPresence : 0,
          UNIFORMS.cursorEffect,
          UNIFORMS.cursorStrength,
          UNIFORMS.cursorRadius
        );

        gl.drawArrays(gl.TRIANGLES, 0, 3);

        const pointerSettling =
          Math.abs(targetX - mouseX) > 0.001 ||
          Math.abs(targetY - mouseY) > 0.001 ||
          Math.abs(targetPresence - cursorPresence) > 0.001;

        if (timeAnimated || pointerSettling) {
          requestRender();
        } else {
          lastNow = null;
        }
      }

      const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
        updatePointerTarget();
        requestRender();
      });
      resizeObserver.observe(root);

      const intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        inView = entry ? entry.isIntersecting : true;
        if (inView) {
          requestRender();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          lastNow = null;
        }
      });
      intersectionObserver.observe(root);

      document.addEventListener("visibilitychange", function () {
        visible = document.visibilityState === "visible";
        if (visible) {
          requestRender();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          lastNow = null;
        }
      });

      window.addEventListener("resize", function () {
        resizeCanvas();
        updatePointerTarget();
        requestRender();
      });

      if (UNIFORMS.cursorEnabled) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointercancel", onPointerLeave);
        window.addEventListener("blur", onPointerLeave);
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
      }

      resizeCanvas();
      requestRender();

      if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.gsap &&
        window.ScrollTrigger
      ) {
        gsap.registerPlugin(ScrollTrigger);

        const movingText = root.querySelector(".js-davinci-scroll");

        if (movingText && !movingText.dataset.davinciInit) {
          movingText.dataset.davinciInit = "true";

          gsap.set(movingText, { yPercent: -10 });

          gsap.to(movingText, {
            yPercent: 70,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "bottom bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      }
    })();
  

    document.addEventListener("DOMContentLoaded", function () {
      const track = document.querySelector(".ticker-track");

      if (track && !track.dataset.cloned) {
        const items = Array.from(track.children);

        items.forEach(function (item) {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          track.appendChild(clone);
        });

        track.dataset.cloned = "true";
      }

      const fadeSection = document.querySelector(".ticker-section");

      if (fadeSection) {
        const observer = new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              fadeSection.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.2
        });

        observer.observe(fadeSection);
      }

      const description = document.getElementById("cpocCreateDescription");

      if (description) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const originalText = description.textContent.trim();

        function buildWords() {
          const words = originalText.split(/\s+/);
          description.innerHTML = "";

          words.forEach((word, index) => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "word";
            wordSpan.textContent = word;
            description.appendChild(wordSpan);

            if (index < words.length - 1) {
              const spaceSpan = document.createElement("span");
              spaceSpan.className = "space";
              spaceSpan.textContent = " ";
              description.appendChild(spaceSpan);
            }
          });
        }

        buildWords();

        const wordNodes = Array.from(description.querySelectorAll(".word"));

        if (reduceMotion) {
          wordNodes.forEach((word) => word.classList.add("is-visible"));
        } else {
          function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
          }

          function updateWordReveal() {
            const rect = description.getBoundingClientRect();
            const viewportH = window.innerHeight || document.documentElement.clientHeight;

            const start = viewportH * 0.92;
            const end = viewportH * 0.28;

            const rawProgress = (start - rect.top) / (start - end);
            const progress = clamp(rawProgress, 0, 1);

            const visibleWords = Math.floor(progress * wordNodes.length);

            wordNodes.forEach((word, index) => {
              if (index < visibleWords) {
                word.classList.add("is-visible");
              } else {
                word.classList.remove("is-visible");
              }
            });
          }

          updateWordReveal();
          window.addEventListener("scroll", updateWordReveal, { passive: true });
          window.addEventListener("resize", updateWordReveal);
        }
      }

      const section = document.querySelector(".cs-wrap");
      const header = document.getElementById("csHeader");
      const card = document.getElementById("csCard");

      if (!section || !header || !card) return;

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function lerp(start, end, progress) {
        return start + (end - start) * progress;
      }

      function isMobile() {
        return window.innerWidth <= 768;
      }

      function updateAnimation() {
        const rect = section.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        const viewportW = window.innerWidth || document.documentElement.clientWidth;

        const cardCenterY = rect.top + rect.height / 2;
        const viewportCenterY = viewportH / 2;
        const distanceFromCenter = cardCenterY - viewportCenterY;
        const rawProgress = 1 - distanceFromCenter / (viewportH * 0.8);
        const progress = clamp(rawProgress, 0, 1);

        const rotateX = lerp(100, 0, progress);

        const baseWidth = card.offsetWidth;
        const targetScale = viewportW / baseWidth;

        const startScale = isMobile() ? 0.82 : 0.95;
        const endScale = targetScale;

        const scale = lerp(startScale, endScale, progress);

        header.style.transform = "translateY(0px)";
        card.style.transform = "rotateX(" + rotateX + "deg) scale(" + scale + ")";
      }

      updateAnimation();
      window.addEventListener("scroll", updateAnimation, { passive: true });
      window.addEventListener("resize", updateAnimation);
    });

    // Prevent scroll restoration on page reload

    // if ('scrollRestoration' in history) {
    //   history.scrollRestoration = 'manual';
    // }

    // window.addEventListener('load', function () {
    //   window.scrollTo(0, 0);
    // });

  

    (function () {
      var aboutSection = document.getElementById("aboutSection");
      var aboutHeading = document.getElementById("aboutHeading");
      var aboutCta = document.getElementById("aboutCta");
      var metricEls = document.querySelectorAll(".about-metric");
      var countEls = document.querySelectorAll(".count");

      function runCounter(el) {
        var start = parseInt(el.getAttribute("data-start"), 10);
        var end = parseInt(el.getAttribute("data-end"), 10);
        var speed = parseInt(el.getAttribute("data-speed"), 10);
        var current = start;
        el.textContent = current;

        var timer = setInterval(function () {
          if (current < end) {
            current++;
            el.textContent = current;
          } else {
            clearInterval(timer);
          }
        }, speed);
      }

      var playedCounters = new WeakSet();

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            if (entry.target === aboutSection) {
              aboutSection.classList.add("in-view");
            }

            if (entry.target === aboutHeading) {
              aboutHeading.classList.add("in-view");
            }

            if (entry.target.classList.contains("about-metric")) {
              entry.target.classList.add("in-view");
              var counter = entry.target.querySelector(".count");
              if (counter && !playedCounters.has(counter)) {
                runCounter(counter);
                playedCounters.add(counter);
              }
            }

            if (entry.target === aboutCta) {
              aboutCta.classList.add("in-view");
            }
          });
        },
        { threshold: 0.5 },
      );

      if (aboutSection) observer.observe(aboutSection);
      if (aboutHeading) observer.observe(aboutHeading);
      if (aboutCta) observer.observe(aboutCta);
      metricEls.forEach(function (el) {
        observer.observe(el);
      });
    })();
  

    document.addEventListener('DOMContentLoaded', () => {
      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = document.querySelector('#service');
      const stackWrap = section?.querySelector('.gp-services-stack-wrap');
      const cards = gsap.utils.toArray('#service .gp-service-card');

      if (!section || !stackWrap || !cards.length) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 992px) and (max-width: 1024px)", () => {
        ScrollTrigger.getAll().forEach(st => st.kill());

        cards.forEach(card => {
          gsap.set(card, { clearProps: "all" });
        });

        gsap.set(stackWrap, { clearProps: "all" });
        gsap.set(section.querySelector('.gp-services-cards'), { clearProps: "all" });

        const spacer = stackWrap.parentElement;
        if (spacer && spacer.classList.contains('pin-spacer')) {
          spacer.style.height = "auto";
          spacer.style.maxHeight = "none";
          spacer.style.minHeight = "0";
          spacer.style.padding = "0";
          spacer.style.margin = "0";
        }
      });

      mm.add("(min-width: 1025px)", () => {
        cards.forEach((card, index) => {
          gsap.set(card, {
            zIndex: cards.length + index,
            yPercent: index === 0 ? 0 : 115,
            scale: 1,
            opacity: 1
          });
        });

        const stepCount = cards.length - 1;
        const stepDuration = 1;
        const scrollPerStep = 420;

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: stackWrap,
            start: "top top+=110",
            end: `+=${stepCount * scrollPerStep}`,
            scrub: 1,
            pin: stackWrap,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        for (let i = 1; i < cards.length; i++) {
          tl.to(cards[i], {
            yPercent: 0,
            duration: stepDuration
          }, (i - 1) * stepDuration);

          tl.to(cards[i - 1], {
            scale: 0.96,
            opacity: 0.5,
            duration: stepDuration
          }, (i - 1) * stepDuration);
        }
      });

      ScrollTrigger.refresh();
    });
  

    (function () {
      const section = document.getElementById("processSticky");
      const header = document.getElementById("processHeaderReveal");
      const line = document.getElementById("processGoldLine");

      const cards = [
        document.getElementById("processCard1"),
        document.getElementById("processCard2"),
        document.getElementById("processCard3"),
        document.getElementById("processCard4"),
      ];

      if (!section || !header || !line || cards.some(card => !card)) return;

      const desktopStates = [
        [
          { x: 2000, r: 0 },
          { x: 2000, r: 0 },
          { x: 2000, r: 0 },
          { x: 2000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 2000, r: 0 },
          { x: 2000, r: 0 },
          { x: 2000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 350, r: 0 },
          { x: 2000, r: 0 },
          { x: 2000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 350, r: 0 },
          { x: 700, r: 0 },
          { x: 2000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 350, r: 0 },
          { x: 700, r: 0 },
          { x: 1050, r: 0 },
        ],
      ];

      const tabletStates = [
        [
          { y: 40, s: 0, o: 0 },
          { y: 40, s: 0, o: 0 },
          { y: 40, s: 0, o: 0 },
          { y: 40, s: 0, o: 0 },
        ],
        [
          { y: 0, s: 1, o: 1 },
          { y: 40, s: 0, o: 0 },
          { y: 40, s: 0, o: 0 },
          { y: 40, s: 0, o: 0 },
        ],
        [
          { y: 0, s: 1, o: 1 },
          { y: 0, s: 1, o: 1 },
          { y: 40, s: 0, o: 0 },
          { y: 40, s: 0, o: 0 },
        ],
        [
          { y: 0, s: 1, o: 1 },
          { y: 0, s: 1, o: 1 },
          { y: 0, s: 1, o: 1 },
          { y: 40, s: 0, o: 0 },
        ],
        [
          { y: 0, s: 1, o: 1 },
          { y: 0, s: 1, o: 1 },
          { y: 0, s: 1, o: 1 },
          { y: 0, s: 1, o: 1 },
        ],
      ];
      const phoneStates = [
        [
          { x: 1000, r: 0 },
          { x: 1000, r: 0 },
          { x: 1000, r: 0 },
          { x: 1000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 1000, r: 0 },
          { x: 1000, r: 0 },
          { x: 1000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 0, r: 0 },
          { x: 1000, r: 0 },
          { x: 1000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 0, r: 0 },
          { x: 0, r: 0 },
          { x: 1000, r: 0 },
        ],
        [
          { x: 0, r: 0 },
          { x: 0, r: 0 },
          { x: 0, r: 0 },
          { x: 0, r: 0 },
        ],
      ];

      const linePositions = {
        desktop: [-2000, -1040, -760, -430, -110, 100],
        tablet: [-1300, -700, -500, -280, -90, 0],
        phone: [-520, -390, -260, -140, -60, 0],
      };

      let headerShown = false;

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function clamp(num, min, max) {
        return Math.max(min, Math.min(max, num));
      }

      function getMode() {
        if (window.innerWidth <= 767.98) return "phone";
        if (window.innerWidth <= 1199.98) return "tablet";
        return "desktop";
      }

      function getStates(mode) {
        if (mode === "phone") return phoneStates;
        if (mode === "tablet") return tabletStates;
        return desktopStates;
      }

      function getLinePositions(mode) {
        if (mode === "phone") return linePositions.phone;
        if (mode === "tablet") return linePositions.tablet;
        return linePositions.desktop;
      }

      function applyState(progress) {
        const mode = getMode();
        const states = getStates(mode);
        const lineStops = getLinePositions(mode);

        const stageProgress = clamp(progress * 4, 0, 3.999);
        const stageIndex = Math.floor(stageProgress);
        const stageT = stageProgress - stageIndex;

        const current = states[stageIndex];
        const next = states[Math.min(stageIndex + 1, states.length - 1)];

        cards.forEach((card, i) => {
          if (mode === "tablet") {
            const y = lerp(current[i].y ?? 0, next[i].y ?? 0, stageT);
            const s = lerp(current[i].s ?? 1, next[i].s ?? 1, stageT);
            const o = lerp(current[i].o ?? 1, next[i].o ?? 1, stageT);

            card.style.transform = `translateX(-50%) translateY(${y}px) scale(${s})`;
            card.style.opacity = o;
            card.style.zIndex = 7 + i;
          } else {
            const x = lerp(current[i].x ?? 0, next[i].x ?? 0, stageT);
            const r = lerp(current[i].r ?? 0, next[i].r ?? 0, stageT);

            card.style.transform = `translateX(${x}px) rotate(${r}deg)`;
            card.style.opacity = 1;
            card.style.zIndex = "";
          }
        });

        const lineCurrent = lineStops[stageIndex];
        const lineNext = lineStops[Math.min(stageIndex + 1, lineStops.length - 1)];
        const lineX = lerp(lineCurrent, lineNext, stageT);
        line.style.transform = `translateX(${lineX}px)`;
      }

      function onScroll() {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const traveled = clamp(-rect.top, 0, total);
        const progress = total > 0 ? traveled / total : 0;

        if (!headerShown) {
          const revealPoint = window.innerHeight * 0.85;
          if (rect.top < revealPoint) {
            header.classList.add("is-visible");
            headerShown = true;
          }
        }

        applyState(progress);
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    })();
  

    document.querySelectorAll(".bento-card").forEach((card) => {
      card.addEventListener(
        "touchstart",
        () => {
          card.classList.add("is-touching");
        },
        { passive: true }
      );

      card.addEventListener(
        "touchend",
        () => {
          setTimeout(() => card.classList.remove("is-touching"), 150);
        },
        { passive: true }
      );
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll(".reveal");

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -10% 0px"
        }
      );

      revealItems.forEach((item) => observer.observe(item));
    }
  

    (function () {
      const titles = document.querySelectorAll('.js-faq-title, .js-faq-contact-title');

      titles.forEach((title) => {
        const text = title.textContent.trim();
        const words = text.split(' ');

        title.innerHTML = words
          .map((word, index) => {
            return '<span class="word" style="transition-delay:' + (index * 0.08) + 's">' + word + '</span>';
          })
          .join(' ');

        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          });
        }, {
          threshold: 0.35,
          rootMargin: '0px 0px -20px 0px'
        });

        observer.observe(title);
      });
    })();
  

    (function () {
      const accordion = document.querySelector('[data-faq-accordion]');
      if (!accordion) return;

      const items = Array.from(accordion.querySelectorAll('.faq-item'));

      function openItem(item) {
        const button = item.querySelector('.faq-item__trigger');
        const panel = item.querySelector('.faq-item__panel');

        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }

      function closeItem(item) {
        const button = item.querySelector('.faq-item__trigger');
        const panel = item.querySelector('.faq-item__panel');

        item.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }

      items.forEach((item) => {
        const button = item.querySelector('.faq-item__trigger');

        button.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          items.forEach(closeItem);

          if (!isOpen) {
            openItem(item);
          }
        });
      });

      items.forEach((item) => {
        if (item.classList.contains('is-open')) {
          openItem(item);
        } else {
          closeItem(item);
        }
      });
    })();
  

    (function () {
      var section = document.getElementById("cpoc-services-hover-v2");
      if (!section || section.dataset.cpocInit === "true") return;
      section.dataset.cpocInit = "true";

      var rows = section.querySelectorAll(".cpoc-project-row");
      var modal = section.querySelector(".cpoc-hover-modal");
      var track = section.querySelector(".cpoc-hover-track");
      var cursor = section.querySelector(".cpoc-hover-cursor");
      var label = section.querySelector(".cpoc-hover-label");
      var isDesktop = window.matchMedia("(min-width: 1025px)");

      if (!rows.length || !modal || !track || !cursor || !label) return;

      var targetX = window.innerWidth / 2;
      var targetY = window.innerHeight / 2;
      var currentX = targetX;
      var currentY = targetY;
      var rafId = null;

      function setActive(index) {
        track.style.transform = "translateY(" + index * -100 + "%)";
      }

      function showModal(index) {
        if (!isDesktop.matches) return;
        setActive(index);
        modal.classList.add("is-active");
        cursor.classList.add("is-active");
        label.classList.add("is-active");
      }

      function hideModal() {
        modal.classList.remove("is-active");
        cursor.classList.remove("is-active");
        label.classList.remove("is-active");
      }

      function animate() {
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;

        var modalTransform = "translate3d(" + currentX + "px," + currentY + "px,0) translate(-50%, -50%)";
        var cursorTransform = "translate3d(" + currentX + "px," + currentY + "px,0) translate(-50%, -50%)";
        var labelTransform = "translate3d(" + currentX + "px," + currentY + "px,0) translate(-50%, -50%)";

        modal.style.left = "0px";
        modal.style.top = "0px";
        cursor.style.left = "0px";
        cursor.style.top = "0px";
        label.style.left = "0px";
        label.style.top = "0px";

        if (modal.classList.contains("is-active")) modal.style.transform = modalTransform + " scale(1)";
        if (cursor.classList.contains("is-active")) cursor.style.transform = cursorTransform + " scale(1)";
        if (label.classList.contains("is-active")) label.style.transform = labelTransform + " scale(1)";

        rafId = requestAnimationFrame(animate);
      }

      rows.forEach(function (row) {
        row.addEventListener("mouseenter", function () {
          showModal(Number(row.getAttribute("data-index")) || 0);
        });
      });

      section.addEventListener("mouseleave", hideModal);

      section.addEventListener("mousemove", function (e) {
        if (!isDesktop.matches) return;
        targetX = e.clientX;
        targetY = e.clientY;
      });

      window.addEventListener("resize", function () {
        if (!isDesktop.matches) hideModal();
      });

      if (!rafId) animate();
    })();
  

    document.querySelectorAll(".faq-ornament").forEach(function (el) {
      el.setAttribute("data-ready", "true");
    });
  

    (function () {
      const revealItems = document.querySelectorAll(
        ".reveal-footer-up, .reveal-footer-link, .reveal-footer-brand, .reveal-footer-copy, .reveal-grid",
      );

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.5,
        },
      );

      revealItems.forEach((item) => observer.observe(item));
    })();
  

    (() => {
      const cursor = document.querySelector(".card-hover-cursor");
      const hoverTargets = document.querySelectorAll(".gp-service-card, .bento-card");

      if (!cursor || !hoverTargets.length) return;

      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;
      let active = false;

      const moveCursor = () => {
        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${active ? 1 : 0.78})`;
        requestAnimationFrame(moveCursor);
      };

      requestAnimationFrame(moveCursor);

      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      hoverTargets.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          active = true;
          cursor.classList.add("is-visible");
        });

        item.addEventListener("mouseleave", () => {
          active = false;
          cursor.classList.remove("is-visible");
        });
      });

      window.addEventListener("mousedown", () => {
        if (active) cursor.style.opacity = "0.9";
      });

      window.addEventListener("mouseup", () => {
        if (active) cursor.style.opacity = "1";
      });
    })();
  

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#cpoc-services-hover-v2");

    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const heading = section.querySelector(".cpoc-services-heading");
    const intro = section.querySelector(".cpoc-services-intro");
    const projectRows = [
      ...section.querySelectorAll(".cpoc-project-row"),
    ];

    /*
      Converts text into:
      <span class="reveal-word">Selected</span>
      <span class="reveal-space"> </span>
      <span class="reveal-word">systems</span>
      ...
      
      It does not remove the <br> in your title.
    */
    function splitWords(element) {
      if (!element || element.dataset.wordsReady === "true") return;

      const textWalker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            return node.nodeValue.trim().length
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      const textNodes = [];
      let node;

      while ((node = textWalker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach((textNode) => {
        const fragment = document.createDocumentFragment();
        const parts = textNode.nodeValue.split(/(\s+)/);

        parts.forEach((part) => {
          if (!part) return;

          if (/^\s+$/.test(part)) {
            const space = document.createElement("span");
            space.className = "reveal-space";
            space.textContent = part;
            fragment.appendChild(space);
            return;
          }

          const word = document.createElement("span");
          word.className = "reveal-word";
          word.textContent = part;
          fragment.appendChild(word);
        });

        textNode.parentNode.replaceChild(fragment, textNode);
      });

      element.dataset.wordsReady = "true";
    }

    /* Create the word spans before the section is revealed */
    splitWords(heading);
    splitWords(intro);

    function revealSection() {
      if (section.dataset.revealed === "true") return;

      section.dataset.revealed = "true";
      section.classList.add("is-visible");

      const headingWords = [
        ...section.querySelectorAll(
          ".cpoc-services-heading .reveal-word"
        ),
      ];

      const introWords = [
        ...section.querySelectorAll(
          ".cpoc-services-intro .reveal-word"
        ),
      ];

      /* No animation for visitors using reduced-motion */
      if (reducedMotion) {
        projectRows.forEach((row) => {
          row.classList.add("is-revealed");
        });
        return;
      }

      /*
        Heading words:
        first word starts after 180ms
        every next word starts 75ms later
      */
      const headingStart = 180;
      const headingSpeed = 75;

      headingWords.forEach((word, index) => {
        word.style.transitionDelay = `${
          headingStart + index * headingSpeed
        }ms`;
      });

      /*
        Intro starts after the heading is done.
        It is faster because it contains more words.
      */
      const headingEnd =
        headingStart + headingWords.length * headingSpeed;

      const introStart = headingEnd + 220;
      const introSpeed = 22;

      introWords.forEach((word, index) => {
        word.style.transitionDelay = `${
          introStart + index * introSpeed
        }ms`;
      });

      /*
        Projects start only after the intro finishes.
        Every project starts 580ms after the previous project.
      */
      const introEnd = introStart + introWords.length * introSpeed;
      const projectStart = introEnd + 450;
      const projectGap = 580;

      projectRows.forEach((row, index) => {
        setTimeout(() => {
          row.classList.add("is-revealed");
        }, projectStart + index * projectGap);
      });
    }

    /* Immediate fallback */
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealSection();
      return;
    }

    /* Reveal only once after section enters viewport */
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          revealSection();
          activeObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(section);
  });
