import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

let imagePath = "";
let isAnimated = false;

async function convertImage(fileType: string) {
  const pathParts = imagePath.split(".");
  const pathPrefix = pathParts.slice(0, pathParts.length - 1).join("");
  await invoke("convert_image", { path: imagePath, pathPrefix: pathPrefix, fileType: fileType });
}

async function openFile() {
  const selected = await open({
    title: "Open WebP",
    multiple: false,
    directory: false,
    filters: [
      {
        name: "Image",
        extensions: ["webp"],
      },
    ],
  });
  if (selected && typeof selected === "string") {
    imagePath = selected;
    showImage(imagePath);
  }
}

function showImage(path: string) {
  const oldImage = document.getElementById("image");
  if (oldImage) oldImage.remove();

  const previewEl = document.getElementById("preview");
  const image = document.createElement("img");
  image.setAttribute("src", convertFileSrc(path));
  image.setAttribute("alt", "image preview");
  image.id = "image";
  previewEl?.appendChild(image);

  fetch(image.src)
    .then((res) => {
      return res.text();
    })
    .then((text) => {
      // console.log(text.slice(0, 50))
      const headerSlice = text.slice(0, 50);
      if (headerSlice.includes("ANIM") && headerSlice.includes("ANMF")) {
        isAnimated = true;
      }
      // console.log(isAnimated);
    })
}

window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#pathButton")
    ?.addEventListener("click", () => openFile());

  document
    .querySelector("#pngButton")
    ?.addEventListener("click", () => convertImage(".png"));
  document
    .querySelector("#gifButton")
    ?.addEventListener("click", () => convertImage(".gif"));
  document
    .querySelector("#jpgButton")
    ?.addEventListener("click", () => convertImage(".jpg"));
});
