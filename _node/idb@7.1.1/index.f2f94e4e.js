const E=(e,t)=>t.some(n=>e instanceof n);let b,I;function h(){return b||(b=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function y(){return I||(I=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const g=new WeakMap,l=new WeakMap,m=new WeakMap,p=new WeakMap,D=new WeakMap;function L(e){const t=new Promise((n,r)=>{const a=()=>{e.removeEventListener("success",i),e.removeEventListener("error",o)},i=()=>{n(c(e.result)),a()},o=()=>{r(e.error),a()};e.addEventListener("success",i),e.addEventListener("error",o)});return t.then(n=>{n instanceof IDBCursor&&g.set(n,e)}).catch(()=>{}),D.set(t,e),t}function k(e){if(l.has(e))return;const t=new Promise((n,r)=>{const a=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",o),e.removeEventListener("abort",o)},i=()=>{n(),a()},o=()=>{r(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",i),e.addEventListener("error",o),e.addEventListener("abort",o)});l.set(e,t)}let v={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return l.get(e);if(t==="objectStoreNames")return e.objectStoreNames||m.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return c(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function x(e){v=e(v)}function j(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(f(this),t,...n);return m.set(r,t.sort?t.sort():[t]),c(r)}:y().includes(e)?function(...t){return e.apply(f(this),t),c(g.get(this))}:function(...t){return c(e.apply(f(this),t))}}function M(e){return typeof e=="function"?j(e):(e instanceof IDBTransaction&&k(e),E(e,h())?new Proxy(e,v):e)}function c(e){if(e instanceof IDBRequest)return L(e);if(p.has(e))return p.get(e);const t=M(e);return t!==e&&(p.set(e,t),D.set(t,e)),t}const f=e=>D.get(e);function S(e,t,{blocked:n,upgrade:r,blocking:a,terminated:i}={}){const o=indexedDB.open(e,t),d=c(o);return r&&o.addEventListener("upgradeneeded",s=>{r(c(o.result),s.oldVersion,s.newVersion,c(o.transaction),s)}),n&&o.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),d.then(s=>{i&&s.addEventListener("close",()=>i()),a&&s.addEventListener("versionchange",u=>a(u.oldVersion,u.newVersion,u))}).catch(()=>{}),d}function V(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),c(n).then(()=>{})}const T=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],B=new Map;function w(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(B.get(t))return B.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,a=C.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(a||T.includes(n)))return;const i=async function(o,...d){const s=this.transaction(o,a?"readwrite":"readonly");let u=s.store;return r&&(u=u.index(d.shift())),(await Promise.all([u[n](...d),a&&s.done]))[0]};return B.set(t,i),i}x(e=>({...e,get:(t,n,r)=>w(t,n)||e.get(t,n,r),has:(t,n)=>!!w(t,n)||e.has(t,n)}));export{V as deleteDB,S as openDB,f as unwrap,c as wrap};