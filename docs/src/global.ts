
/**
 * @type {Number}
 */
export let loaded: number = 0;

/**
 * @type {Number}
 */
export let load: number = 0;

/**
 * @type {Map<string, ArrayBuffer>}
 */
export let DATA: Map<string, ArrayBuffer> = new Map();

// @ts-ignore
export function update(event, path) { }

/**
 * Loads javascropt code
 *
 * @function
 * @author Hoodgail Benjamin
 * @param {string} url javascript code url
 */
export function javascript(url: string): Promise<Event> {
     load += 1;
     return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          document.body.appendChild(script);
          script.onload = e => (resolve(e), update(e, url));
          script.onerror = reject;
          script.async = true;
          script.src = url;
     });
};

/**
 * Loads css stylesheet
 *
 * @function
 * @author Hoodgail Benjamin
 * @param {string} url stylesheet css url
 * @returns {Promise<Event>}
 */
export function stylesheet(url: string): Promise<Event> {
     load += 1;
     return new Promise((resolve, reject) => {
          const link = document.createElement('link');
          document.head.appendChild(link);
          link.onload = e => (resolve(e), update(e, url));
          link.onerror = reject;
          link.rel = "stylesheet"
          link.href = url;
     });
};

export interface PreloadEvent {
     timeStamp?: number;
     error?: Error;
}

/**
 * Preload files
 *
 * @function
 * @author Hoodgail Benjamin
 * @param {string} path file url path
 * @return {Promise<Event>}
 */
export function preload(path: string): Promise<PreloadEvent> {
     load += 1;
     let now = Date.now();
     return new Promise(async (resolve, reject) => {
          let event: PreloadEvent = {};

          try {
               let data = await fetch(path);
               let buffer = await data.arrayBuffer();

               DATA.set(path, buffer)

               event.timeStamp = Date.now() - now;
          } catch (e) { event.error = new Error(e); };

          update(event, path);
          resolve(event)
     })
}

// @ts-ignore
Number.prototype.round = function (decimals) {
     if (typeof decimals === 'undefined') decimals = 0;

     // @ts-ignore
     return Math.round(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
};


// @ts-ignore
Array.prototype.random = function () {
     return this[Math.floor(Math.random() * this.length)]
}

// @ts-ignore
Array.prototype.getIndex = function (value) {
     for (let index in this) { if (value == this[index]) return index; }
     return null;
}


// @ts-ignore
Number.prototype.now = function () {

     // @ts-ignore
     return Date.now() - this;
}

// @ts-ignore
Math.toRadians = function (degrees) {
     return degrees * (Math.PI / 180);
}

// @ts-ignore
Number.prototype.timeSince = function () {

     // @ts-ignore
     let date = new Date(this);
     let seconds = Math.floor((Date.now() - date.getTime()) / 1000);

     let interval = seconds / 31536000;

     if (interval > 1) return Math.floor(interval) + " years";

     interval = seconds / 2592000;
     if (interval > 1) return Math.floor(interval) + " months";

     interval = seconds / 86400;
     if (interval > 1) return Math.floor(interval) + " days";

     interval = seconds / 3600;
     if (interval > 1) return Math.floor(interval) + " hours";

     interval = seconds / 60;
     if (interval > 1) return Math.floor(interval) + " minutes";

     return Math.floor(seconds) + " seconds";
}

export const GLOBAL = {};