// src/components/button.tsx
import { jsx } from "react/jsx-runtime";
function Button(props) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: `px-4 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-400 uppercase ${props.className}`,
      children: props.children
    }
  );
}
export {
  Button
};
//# sourceMappingURL=index.mjs.map