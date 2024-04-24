//==========================================================
// style-swap.js
//
// An extension to htmx 1.0 to put body styles in the head.
//==========================================================
(function () {
  htmx.defineExtension("style-swap", {
    transformResponse: function (text, _xhr, _elt) {
      //has style tag
      if (!text.match(/(<style(\s[^>]*>|>)([\s\S]*?)<\/style>)/im)) {
        return text;
      }

      //find head
      var head = document.getElementsByTagName("head")[0];
      if (!head) {
        return text;
      }

      //parse response
      var dom = new DOMParser().parseFromString(text, "text/html");
      var styles = dom.getElementsByTagName("style");

      for (var i = 0; i < styles.length; i++) {
        var styleInHead = null;

        //check if style is already in head
        if (styles[i].hasAttribute("id"))
          styleInHead = document.getElementById(styles[i].id);

        if (styleInHead) {
          //replace with same id in head
          head.replaceChild(styles[i].cloneNode(true), styleInHead);
        } else {
          //add to head
          head.appendChild(styles[i].cloneNode(true));
        }

        //remove from response
        styles[i].parentElement.removeChild(styles[i]);
      }

      return dom.documentElement.outerHTML;
    },
  });
})();
