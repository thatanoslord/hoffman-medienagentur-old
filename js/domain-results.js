(function () {
        /* ============ EDIT THESE ============ */
        // No token here anymore. The token lives in the server-side .env file
        // and is used only by /api/check-domain.php.
        const API_URL = "api/check-domain.php";

        const CURRENCY = "$";
        const SHOW_PRICES = true;
        const MARKUP = 1; // 1 = Hostinger price, 1.2 = +20% margin
        const BUY_URL = "contact.html?domain={domain}";
        // t = extension, c = categories (prices now come from Hostinger)
        const TLDS = [
          { t: "com", c: ["popular", "business"] },
          { t: "net", c: ["popular", "business"] },
          { t: "org", c: ["popular", "professional"] },
          { t: "online", c: ["popular", "social"] },
          { t: "tech", c: ["popular", "technology"] },
          { t: "store", c: ["popular", "business"] },
          { t: "site", c: ["popular", "social"] },
          { t: "info", c: ["popular"] },
          { t: "io", c: ["technology"] },
          { t: "co", c: ["business"] },
          { t: "app", c: ["technology"] },
          { t: "dev", c: ["technology"] },
          { t: "ai", c: ["technology"] },
          { t: "cloud", c: ["technology"] },
          { t: "digital", c: ["technology", "business"] },
          { t: "shop", c: ["business"] },
          { t: "biz", c: ["business"] },
          { t: "pro", c: ["professional"] },
          { t: "studio", c: ["professional", "entertainment"] },
          { t: "blog", c: ["social"] },
          { t: "space", c: ["social"] },
          { t: "me", c: ["social", "international"] },
          { t: "live", c: ["entertainment"] },
          { t: "fun", c: ["entertainment"] },
          { t: "academy", c: ["education"] },
          { t: "school", c: ["education"] },
          { t: "de", c: ["international"] },
          { t: "eu", c: ["international"] },
          { t: "ma", c: ["international"] },
          { t: "fr", c: ["international"] },
        ];
        const CHUNK = 10; // TLDs per availability request (the PHP allows max 15)
        /* ==================================== */

        const CATS = [
          ["popular", "Popular"],
          ["business", "Business"],
          ["education", "Education"],
          ["international", "International"],
          ["technology", "Technology"],
          ["social", "Social"],
          ["professional", "Professional"],
          ["entertainment", "Entertainment"],
          ["all", "All"],
        ];
        const $ = (id) => document.getElementById(id);
        const esc = (v) =>
          String(v).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
        const money = (n) => CURRENCY + Number(n).toFixed(2);
        const buy = (d) => BUY_URL.replace("{domain}", encodeURIComponent(d));
        const info = (t) => TLDS.find((x) => x.t === t);
        const order = (t) => {
          const i = TLDS.findIndex((x) => x.t === t);
          return i === -1 ? 999 : i;
        };

        function normalize(v) {
          return v
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/[\/?#].*$/, "")
            .replace(/\s+/g, "");
        }

        /* ---------- Backend API (PHP) ---------- */
        // action = "availability" (POST with a body) or "prices" (GET)
        async function api(action, body) {
          const r = await fetch(
            API_URL + "?action=" + action,
            body
              ? {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }
              : {},
          );
          if (!r.ok) throw new Error("API " + action + " -> HTTP " + r.status);
          return r.json();
        }

        // Real prices from the Hostinger catalog: { com: {p, o}, ... }
        const PRICES = {};
        async function loadPrices() {
          try {
            const items = await api("prices");
            (items || []).forEach((item) => {
              const m = /^\.?([a-z0-9-]+(?:\.[a-z0-9-]+)*)/i.exec(item.name || "");
              if (!m) return;
              const tld = m[1].toLowerCase();
              const yearly = (item.prices || []).find(
                (p) => p.period === 1 && String(p.period_unit).toLowerCase().startsWith("year"),
              );
              if (!yearly) return;
              // Hostinger returns prices in cents
              const regular = yearly.price / 100;
              const first = (yearly.first_period_price != null ? yearly.first_period_price : yearly.price) / 100;
              PRICES[tld] = {
                p: first * MARKUP,
                o: regular > first ? regular * MARKUP : null,
              };
            });
          } catch (e) {
            console.error("Price load failed:", e);
          }
        }

        async function checkChunk(name, tlds) {
          try {
            const res = await api("availability", { domain: name, tlds: tlds });
            return (res || []).map((d) => ({
              domain: d.domain,
              state: d.is_available ? "available" : "taken",
            }));
          } catch (e) {
            console.error("Check failed:", name, tlds, e);
            return tlds.map((t) => ({ domain: name + "." + t, state: "unknown" }));
          }
        }

        const priceHtml = (t) => {
          const x = PRICES[t];
          if (!SHOW_PRICES || !x) return "";
          return (
            '<div class="price">' +
            (x.o ? "<s>" + money(x.o) + "/1st yr</s>" : "") +
            "<b>" + money(x.p) + "</b></div>"
          );
        };

        /* ---------- search form ---------- */
        const q = normalize(new URLSearchParams(location.search).get("q") || "");
        $("q").value = q;

        const toggleClear = () => {
          $("clear").hidden = !$("q").value;
        };
        $("q").addEventListener("input", toggleClear);
        $("clear").addEventListener("click", () => {
          $("q").value = "";
          toggleClear();
          if (new URLSearchParams(location.search).get("q")) {
            location.href = "domain-results.html";
          } else {
            $("q").focus();
          }
        });
        toggleClear();
        $("form").addEventListener("submit", (e) => {
          e.preventDefault();
          const v = normalize($("q").value);
          if (v) location.href = "domain-results.html?q=" + encodeURIComponent(v);
        });

        const infoIcon =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01" stroke-linecap="round"/></svg>';
        const checkIcon =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

        if (!q) {
          $("banner").innerHTML =
            '<div class="banner">' + infoIcon + "<span>Type a name above to see which domains are available.</span></div>";
          return;
        }

        const dot = q.indexOf(".");
        const name = dot === -1 ? q : q.slice(0, dot);
        const mainTld = dot === -1 ? "com" : q.slice(dot + 1);
        if (!/^[a-z0-9-]+$/.test(name) || !mainTld) {
          $("banner").innerHTML =
            '<div class="banner is-error">' + infoIcon +
            "<span>Use letters, numbers and hyphens only, for example <b>zeb</b> or <b>zeb.com</b>.</span></div>";
          return;
        }
        const mainDomain = name + "." + mainTld;

        /* ---------- state ---------- */
        let main = null,
          done = false,
          checked = 0,
          cat = "popular";
        const found = [];
        const toCheck = TLDS.map((x) => x.t).filter((t) => t !== mainTld);

        function renderBanner() {
          const el = $("banner");
          if (!main) {
            el.innerHTML = '<div class="status"><span class="spin"></span>Checking ' + esc(mainDomain) + "…</div>";
            return;
          }
          if (main.state === "available")
            el.innerHTML =
              '<div class="banner">' + infoIcon + "<span><b>" + esc(mainDomain) +
              "</b> is available. Get it before someone else does.</span></div>";
          else if (main.state === "taken")
            el.innerHTML =
              '<div class="banner">' + infoIcon + "<span><b>" + esc(mainDomain) + "</b> is already taken." +
              (found.length
                ? " We found a great alternative just for you!"
                : done
                  ? " We found no available alternatives. Try a different name."
                  : " Looking for alternatives…") +
              "</span></div>";
          else
            el.innerHTML =
              '<div class="banner is-error">' + infoIcon + "<span>We could not confirm <b>" + esc(mainDomain) +
              "</b> right now. Please try again shortly.</span></div>";
        }

        function renderFeature() {
          const el = $("feature");
          let pick = null,
            badge = "Great alternative";
          if (main && main.state === "available") {
            pick = main.domain;
            badge = "Your domain";
          } else if (main && main.state !== "unknown" && found.length) pick = found[0].domain;
          if (!pick) {
            el.innerHTML = "";
            return;
          }
          const t = pick.slice(pick.indexOf(".") + 1);
          el.innerHTML =
            '<div class="feature"><div class="feature-top"><div><span class="badge">' + badge +
            "</span><h2>" + esc(pick) + "</h2></div>" +
            '<div class="feature-right">' + priceHtml(t) +
            '<a class="btn-solid" href="' + buy(pick) + '">Make it yours</a></div></div>' +
            '<div class="feature-note">' + checkIcon +
            "<span>." + esc(t) + " domains work for any digital project, anywhere.</span></div></div>";
        }

        function renderChips() {
          $("chips").innerHTML = CATS.map(
            ([k, label]) =>
              '<button type="button" class="chip' + (k === cat ? " is-active" : "") +
              '" data-cat="' + k + '" role="tab" aria-selected="' + (k === cat) + '">' + label + "</button>",
          ).join("");
        }

        function renderList() {
          const rows = found.filter((r) => cat === "all" || (info(r.t) && info(r.t).c.includes(cat)));
          let html = rows
            .map(
              (r) =>
                '<div class="row"><span class="row-name">' + esc(r.domain) +
                '</span><div class="row-right">' + priceHtml(r.t) +
                '<a class="btn-line" href="' + buy(r.domain) + '">Get it</a></div></div>',
            )
            .join("");
          if (!done)
            html += '<div class="status"><span class="spin"></span>Checked ' + checked + " of " + toCheck.length + " extensions…</div>";
          else if (!rows.length)
            html +=
              '<div class="status">' +
              (cat === "all"
                ? "No available extensions found for this name."
                : "Nothing available in this category. Try “All”.") +
              "</div>";
          $("list").innerHTML = html;
        }

        const renderAll = () => {
          renderBanner();
          renderFeature();
          renderList();
        };

        $("chips").addEventListener("click", (e) => {
          const b = e.target.closest("[data-cat]");
          if (!b) return;
          cat = b.dataset.cat;
          renderChips();
          renderList();
        });

        $("more").hidden = false;
        renderChips();
        renderAll();

        /* ---------- run checks ---------- */
        const pricesTask = loadPrices();

        // First request: the searched extension plus the first batch of others
        const others = toCheck.slice();
        const chunks = [];
        const firstList = [mainTld].concat(others.splice(0, CHUNK - 1));
        chunks.push(firstList);
        while (others.length) chunks.push(others.splice(0, CHUNK));

        const tasks = chunks.map(async (list) => {
          const results = await checkChunk(name, list);
          await pricesTask; // make sure prices are ready before rendering rows
          results.forEach((r) => {
            const t = r.domain.slice(r.domain.indexOf(".") + 1);
            if (r.domain === mainDomain) {
              main = { domain: mainDomain, state: r.state };
            } else {
              checked++;
              if (r.state === "available") {
                found.push({ domain: r.domain, t: t });
                found.sort((a, b) => order(a.t) - order(b.t));
              }
            }
          });
          // extension not returned by Hostinger at all
          if (list.includes(mainTld) && !main) main = { domain: mainDomain, state: "unknown" };
          renderAll();
        });

        Promise.all(tasks).then(() => {
          if (!main) main = { domain: mainDomain, state: "unknown" };
          done = true;
          renderAll();
        });
      })();
