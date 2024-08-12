/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

class Loader {
    /**
     * Start the loader
     *
     * @return {void}
     */
    static startLoader(){
        const loader = document.getElementById("loader");
        if (!loader) return;

        const output = document.getElementById("output");
        if (!output) return;

        output.style.display = "none";
        loader.style.display = "grid";
    }

    /**
     * Stop the loader
     *
     * @return {void}
     */
    static stopLoader(){
        const loader = document.getElementById("loader");
        if (!loader) return;

        const output = document.getElementById("output");
        if (!output) return;

        loader.style.display = "none";
        output.style.display = "block";
    }
}

export default Loader;
