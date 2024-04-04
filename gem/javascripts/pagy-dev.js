"use strict";
window.Pagy = (() => {
    // The observer instance for responsive navs
    const rjsObserver = new ResizeObserver(entries => entries.forEach(e => e.target.querySelectorAll(".pagy-rjs").forEach(el => el.pagyRender())));
    // Init the *_nav_js helpers
    const initNav = (el, [tokens, sequels, labelSequels, trimParam]) => {
        const container = el.parentElement ?? el;
        const widths = Object.keys(sequels).map(w => parseInt(w)).sort((a, b) => b - a);
        let lastWidth = -1;
        const fillIn = (a, page, label) => a.replace(/__pagy_page__/g, page).replace(/__pagy_label__/g, label);
        (el.pagyRender = function () {
            const width = widths.find(w => w < container.clientWidth) || 0;
            if (width === lastWidth) {
                return;
            } // no change: abort
            let html = tokens.before; // already trimmed in html
            const series = sequels[width.toString()];
            const labels = labelSequels?.[width.toString()] ?? series.map(l => l.toString());
            for (const i in series) {
                const item = series[i];
                const label = labels[i];
                let filled;
                if (typeof item === "number") {
                    filled = fillIn(tokens.a, item.toString(), label);
                }
                else if (item === "gap") {
                    filled = tokens.gap;
                }
                else { // active page
                    filled = fillIn(tokens.current, item, label);
                }
                html += (typeof trimParam === "string" && item == 1) ? trim(filled, trimParam) : filled;
            }
            html += tokens.after; // eslint-disable-line align-assignments/align-assignments
            el.innerHTML = "";
            el.insertAdjacentHTML("afterbegin", html);
            lastWidth = width;
        })();
        if (el.classList.contains("pagy-rjs")) {
            rjsObserver.observe(container);
        }
    };
    // Init the *_combo_nav_js helpers
    const initCombo = (el, [url_token, trimParam]) => initInput(el, inputValue => [inputValue, url_token.replace(/__pagy_page__/, inputValue)], trimParam);
    // Init the items_selector_js helper
    const initSelector = (el, [from, url_token, trimParam]) => {
        initInput(el, inputValue => {
            const page = Math.max(Math.ceil(from / parseInt(inputValue)), 1).toString();
            const url = url_token.replace(/__pagy_page__/, page).replace(/__pagy_items__/, inputValue);
            return [page, url];
        }, trimParam);
    };
    // Init the input element
    const initInput = (el, getVars, trimParam) => {
        const input = el.querySelector("input");
        const link = el.querySelector("a");
        const initial = input.value;
        const action = function () {
            if (input.value === initial) {
                return;
            } // not changed
            const [min, val, max] = [input.min, input.value, input.max].map(n => parseInt(n) || 0);
            if (val < min || val > max) { // reset invalid/out-of-range
                input.value = initial;
                input.select();
                return;
            }
            let [page, url] = getVars(input.value); // eslint-disable-line prefer-const
            if (typeof trimParam === "string" && page === "1") {
                url = trim(url, trimParam);
            }
            link.href = url;
            link.click();
        };
        ["change", "focus"].forEach(e => input.addEventListener(e, input.select)); // auto-select
        input.addEventListener("focusout", action); // trigger action
        input.addEventListener("keypress", e => { if (e.key === "Enter") {
            action();
        } }); // trigger action
    };
    // Trim the ${page-param}=1 params in links
    const trim = (a, param) => a.replace(new RegExp(`[?&]${param}=1\\b(?!&)|\\b${param}=1&`), "");
    // Public interface
    return {
        version: "8.0.1",
        // Scan for elements with a "data-pagy" attribute and call their init functions with the decoded args
        init(arg) {
            const target = arg instanceof Element ? arg : document;
            const elements = target.querySelectorAll("[data-pagy]");
            for (const el of elements) {
                try {
                    const uint8array = Uint8Array.from(atob(el.getAttribute("data-pagy")), c => c.charCodeAt(0));
                    const [keyword, ...args] = JSON.parse((new TextDecoder()).decode(uint8array)); // base64-utf8 -> JSON -> Array
                    if (keyword === "nav") {
                        initNav(el, args);
                    }
                    else if (keyword === "combo") {
                        initCombo(el, args);
                    }
                    else if (keyword === "selector") {
                        initSelector(el, args);
                    }
                    else {
                        console.warn("Skipped Pagy.init() for: %o\nUnknown keyword '%s'", el, keyword);
                    }
                }
                catch (err) {
                    console.warn("Skipped Pagy.init() for: %o\n%s", el, err);
                }
            }
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQWtCQSxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRTtJQUNmLDRDQUE0QztJQUM1QyxNQUFNLFdBQVcsR0FBRyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFhLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FDM0UsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEUsNEJBQTRCO0lBQzVCLE1BQU0sT0FBTyxHQUFHLENBQUMsRUFBYSxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFTLEVBQUUsRUFBRTtRQUNsRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoRixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQVEsRUFBRSxJQUFXLEVBQUUsS0FBWSxFQUFTLEVBQUUsQ0FDMUQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQyxFQUFFLENB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TyxHQUFHLEVBQUUsQ0FBQztvQkFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFBQyxDQUFDO1lBQzlFLENBQUM7UUFDTCxDQUFDO0tBQ0osQ0FBQztBQUNOLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIE5hdkFyZ3MgPSByZWFkb25seSBbVG9rZW5zLCBTZXF1ZWxzLCBudWxsIHwgTGFiZWxTZXF1ZWxzLCBzdHJpbmc/XVxudHlwZSBDb21ib0FyZ3MgPSByZWFkb25seSBbc3RyaW5nLCBzdHJpbmc/XVxudHlwZSBTZWxlY3RvckFyZ3MgPSByZWFkb25seSBbbnVtYmVyLCBzdHJpbmcsIHN0cmluZz9dXG5cbmludGVyZmFjZSBUb2tlbnMge1xuICAgIHJlYWRvbmx5IGJlZm9yZTpzdHJpbmdcbiAgICByZWFkb25seSBhOnN0cmluZ1xuICAgIHJlYWRvbmx5IGN1cnJlbnQ6c3RyaW5nXG4gICAgcmVhZG9ubHkgZ2FwOnN0cmluZ1xuICAgIHJlYWRvbmx5IGFmdGVyOnN0cmluZ1xufVxuXG5pbnRlcmZhY2UgU2VxdWVscyB7cmVhZG9ubHkgW3dpZHRoOnN0cmluZ106KHN0cmluZyB8IG51bWJlcilbXX1cblxuaW50ZXJmYWNlIExhYmVsU2VxdWVscyB7cmVhZG9ubHkgW3dpZHRoOnN0cmluZ106c3RyaW5nW119XG5cbmludGVyZmFjZSBOYXZFbGVtZW50IGV4dGVuZHMgRWxlbWVudCB7cGFneVJlbmRlcigpOnZvaWR9XG5cbmNvbnN0IFBhZ3kgPSAoKCkgPT4ge1xuICAgIC8vIFRoZSBvYnNlcnZlciBpbnN0YW5jZSBmb3IgcmVzcG9uc2l2ZSBuYXZzXG4gICAgY29uc3QgcmpzT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoZW50cmllcyA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goZSA9PiBlLnRhcmdldC5xdWVyeVNlbGVjdG9yQWxsPE5hdkVsZW1lbnQ+KFwiLnBhZ3ktcmpzXCIpLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbCA9PiBlbC5wYWd5UmVuZGVyKCkpKSk7XG5cbiAgICAvLyBJbml0IHRoZSAqX25hdl9qcyBoZWxwZXJzXG4gICAgY29uc3QgaW5pdE5hdiA9IChlbDpOYXZFbGVtZW50LCBbdG9rZW5zLCBzZXF1ZWxzLCBsYWJlbFNlcXVlbHMsIHRyaW1QYXJhbV06TmF2QXJncykgPT4ge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBlbC5wYXJlbnRFbGVtZW50ID8/IGVsO1xuICAgICAgICBjb25zdCB3aWR0aHMgPSBPYmplY3Qua2V5cyhzZXF1ZWxzKS5tYXAodyA9PiBwYXJzZUludCh3KSkuc29ydCgoYSwgYikgPT4gYiAtIGEpO1xuICAgICAgICBsZXQgbGFzdFdpZHRoID0gLTE7XG4gICAgICAgIGNvbnN0IGZpbGxJbiA9IChhOnN0cmluZywgcGFnZTpzdHJpbmcsIGxhYmVsOnN0cmluZyk6c3RyaW5nID0+XG4gICAgICAgICAgICBhLnJlcGxhY2UoL19fcGFneV9wYWdlX18vZywgcGFnZSkucmVwbGFjZSgvX19wYWd5X2xhYmVsX18vZywgbGFiZWwpO1xuICAgICAgICAoZWwucGFneVJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gd2lkdGhzLmZpbmQodyA9PiB3IDwgY29udGFpbmVyLmNsaWVudFdpZHRoKSB8fCAwO1xuICAgICAgICAgICAgaWYgKHdpZHRoID09PSBsYXN0V2lkdGgpIHsgcmV0dXJuIH0gLy8gbm8gY2hhbmdlOiBhYm9ydFxuICAgICAgICAgICAgbGV0IGh0bWwgPSB0b2tlbnMuYmVmb3JlOyAgLy8gYWxyZWFkeSB0cmltbWVkIGluIGh0bWxcbiAgICAgICAgICAgIGNvbnN0IHNlcmllcyA9IHNlcXVlbHNbd2lkdGgudG9TdHJpbmcoKV07XG4gICAgICAgICAgICBjb25zdCBsYWJlbHMgPSBsYWJlbFNlcXVlbHM/Llt3aWR0aC50b1N0cmluZygpXSA/PyBzZXJpZXMubWFwKGwgPT4gbC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBzZXJpZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gc2VyaWVzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBmaWxsZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxlZCA9IGZpbGxJbih0b2tlbnMuYSwgaXRlbS50b1N0cmluZygpLCBsYWJlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtID09PSBcImdhcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxlZCA9IHRva2Vucy5nYXA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gYWN0aXZlIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgZmlsbGVkID0gZmlsbEluKHRva2Vucy5jdXJyZW50LCBpdGVtLCBsYWJlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGh0bWwgKz0gKHR5cGVvZiB0cmltUGFyYW0gPT09IFwic3RyaW5nXCIgJiYgaXRlbSA9PSAxKSA/IHRyaW0oZmlsbGVkLCB0cmltUGFyYW0pIDogZmlsbGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHRtbCArPSB0b2tlbnMuYWZ0ZXI7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBhbGlnbi1hc3NpZ25tZW50cy9hbGlnbi1hc3NpZ25tZW50c1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgIGVsLmluc2VydEFkamFjZW50SFRNTChcImFmdGVyYmVnaW5cIiwgaHRtbCk7XG4gICAgICAgICAgICBsYXN0V2lkdGggPSB3aWR0aDtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhcInBhZ3ktcmpzXCIpKSB7IHJqc09ic2VydmVyLm9ic2VydmUoY29udGFpbmVyKSB9XG4gICAgfTtcblxuICAgIC8vIEluaXQgdGhlICpfY29tYm9fbmF2X2pzIGhlbHBlcnNcbiAgICBjb25zdCBpbml0Q29tYm8gPSAoZWw6RWxlbWVudCwgW3VybF90b2tlbiwgdHJpbVBhcmFtXTpDb21ib0FyZ3MpID0+XG4gICAgICAgIGluaXRJbnB1dChlbCwgaW5wdXRWYWx1ZSA9PiBbaW5wdXRWYWx1ZSwgdXJsX3Rva2VuLnJlcGxhY2UoL19fcGFneV9wYWdlX18vLCBpbnB1dFZhbHVlKV0sIHRyaW1QYXJhbSk7XG5cbiAgICAvLyBJbml0IHRoZSBpdGVtc19zZWxlY3Rvcl9qcyBoZWxwZXJcbiAgICBjb25zdCBpbml0U2VsZWN0b3IgPSAoZWw6RWxlbWVudCwgW2Zyb20sIHVybF90b2tlbiwgdHJpbVBhcmFtXTpTZWxlY3RvckFyZ3MpID0+IHtcbiAgICAgICAgaW5pdElucHV0KGVsLCBpbnB1dFZhbHVlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBNYXRoLm1heChNYXRoLmNlaWwoZnJvbSAvIHBhcnNlSW50KGlucHV0VmFsdWUpKSwgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHVybF90b2tlbi5yZXBsYWNlKC9fX3BhZ3lfcGFnZV9fLywgcGFnZSkucmVwbGFjZSgvX19wYWd5X2l0ZW1zX18vLCBpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBbcGFnZSwgdXJsXTtcbiAgICAgICAgfSwgdHJpbVBhcmFtKTtcbiAgICB9O1xuXG4gICAgLy8gSW5pdCB0aGUgaW5wdXQgZWxlbWVudFxuICAgIGNvbnN0IGluaXRJbnB1dCA9IChlbDpFbGVtZW50LCBnZXRWYXJzOih2OnN0cmluZykgPT4gW3N0cmluZywgc3RyaW5nXSwgdHJpbVBhcmFtPzpzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBlbC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgbGluayA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgICAgICBjb25zdCBpbml0aWFsID0gaW5wdXQudmFsdWU7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC52YWx1ZSA9PT0gaW5pdGlhbCkgeyByZXR1cm4gfSAgLy8gbm90IGNoYW5nZWRcbiAgICAgICAgICAgIGNvbnN0IFttaW4sIHZhbCwgbWF4XSA9IFtpbnB1dC5taW4sIGlucHV0LnZhbHVlLCBpbnB1dC5tYXhdLm1hcChuID0+IHBhcnNlSW50KG4pIHx8IDApO1xuICAgICAgICAgICAgaWYgKHZhbCA8IG1pbiB8fCB2YWwgPiBtYXgpIHsgIC8vIHJlc2V0IGludmFsaWQvb3V0LW9mLXJhbmdlXG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBpbml0aWFsO1xuICAgICAgICAgICAgICAgIGlucHV0LnNlbGVjdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBbcGFnZSwgdXJsXSA9IGdldFZhcnMoaW5wdXQudmFsdWUpOyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLWNvbnN0XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRyaW1QYXJhbSA9PT0gXCJzdHJpbmdcIiAmJiBwYWdlID09PSBcIjFcIikgeyB1cmwgPSB0cmltKHVybCwgdHJpbVBhcmFtKSB9XG4gICAgICAgICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIH07XG4gICAgICAgIFtcImNoYW5nZVwiLCBcImZvY3VzXCJdLmZvckVhY2goZSA9PiBpbnB1dC5hZGRFdmVudExpc3RlbmVyKGUsIGlucHV0LnNlbGVjdCkpOyAgICAgICAgLy8gYXV0by1zZWxlY3RcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3Vzb3V0XCIsIGFjdGlvbik7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJpZ2dlciBhY3Rpb25cbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGUgPT4geyBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikgeyBhY3Rpb24oKSB9IH0pOyAvLyB0cmlnZ2VyIGFjdGlvblxuICAgIH07XG5cbiAgICAvLyBUcmltIHRoZSAke3BhZ2UtcGFyYW19PTEgcGFyYW1zIGluIGxpbmtzXG4gICAgY29uc3QgdHJpbSA9IChhOnN0cmluZywgcGFyYW06c3RyaW5nKSA9PlxuICAgICAgICBhLnJlcGxhY2UobmV3IFJlZ0V4cChgWz8mXSR7cGFyYW19PTFcXFxcYig/ISYpfFxcXFxiJHtwYXJhbX09MSZgKSwgXCJcIik7XG5cbiAgICAvLyBQdWJsaWMgaW50ZXJmYWNlXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmVyc2lvbjogXCI4LjAuMVwiLFxuXG4gICAgICAgIC8vIFNjYW4gZm9yIGVsZW1lbnRzIHdpdGggYSBcImRhdGEtcGFneVwiIGF0dHJpYnV0ZSBhbmQgY2FsbCB0aGVpciBpbml0IGZ1bmN0aW9ucyB3aXRoIHRoZSBkZWNvZGVkIGFyZ3NcbiAgICAgICAgaW5pdChhcmc/OkVsZW1lbnQgfCBuZXZlcikge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gYXJnIGluc3RhbmNlb2YgRWxlbWVudCA/IGFyZyA6IGRvY3VtZW50O1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSB0YXJnZXQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXBhZ3ldXCIpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbCBvZiBlbGVtZW50cykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVpbnQ4YXJyYXkgPSBVaW50OEFycmF5LmZyb20oYXRvYihlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ3lcIikgYXMgc3RyaW5nKSwgYyA9PiBjLmNoYXJDb2RlQXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBba2V5d29yZCwgLi4uYXJnc10gPSBKU09OLnBhcnNlKChuZXcgVGV4dERlY29kZXIoKSkuZGVjb2RlKHVpbnQ4YXJyYXkpKTsgLy8gYmFzZTY0LXV0ZjggLT4gSlNPTiAtPiBBcnJheVxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5d29yZCA9PT0gXCJuYXZcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdE5hdihlbCBhcyBOYXZFbGVtZW50LCBhcmdzIGFzIE5hdkFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleXdvcmQgPT09IFwiY29tYm9cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdENvbWJvKGVsLCBhcmdzIGFzIENvbWJvQXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5d29yZCA9PT0gXCJzZWxlY3RvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0U2VsZWN0b3IoZWwsIGFyZ3MgYXMgU2VsZWN0b3JBcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlNraXBwZWQgUGFneS5pbml0KCkgZm9yOiAlb1xcblVua25vd24ga2V5d29yZCAnJXMnXCIsIGVsLCBrZXl3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oXCJTa2lwcGVkIFBhZ3kuaW5pdCgpIGZvcjogJW9cXG4lc1wiLCBlbCwgZXJyKSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbiJdfQ==