import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

let imagePath = "";
let isAnimated = false;
let pngButton = document.getElementById("#pngButton") as HTMLButtonElement;
let gifButton = document.querySelector("#gifButton") as HTMLButtonElement;;
let jpgButton = document.querySelector("#jpgButton") as HTMLButtonElement;;

async function convertImage(fileType: string) {
  const pathParts = imagePath.split(".");
  const pathPrefix = pathParts.slice(0, pathParts.length - 1).join("");
  await invoke("convert_image", { path: imagePath, pathPrefix: pathPrefix, fileType: fileType });
}

async function convertAnimatedImage() {
  const pathParts = imagePath.split(".");
  const pathPrefix = pathParts.slice(0, pathParts.length - 1).join("");
  await invoke("convert_animated_image", { path: imagePath, pathPrefix: pathPrefix });
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
      const headerSlice = text.slice(0, 50);
      if (headerSlice.includes("ANIM") && headerSlice.includes("ANMF")) {
        isAnimated = true;
        setAvailableConversions();
      }
    })
}

function setAvailableConversions() {
  if (isAnimated && pngButton && jpgButton) {
    pngButton.disabled = true;
    jpgButton.disabled = true;
  } else {
    pngButton.disabled = false;
    jpgButton.disabled = false;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  pngButton = document.getElementById("pngButton") as HTMLButtonElement;
  gifButton = document.getElementById("gifButton") as HTMLButtonElement;
  jpgButton = document.getElementById("jpgButton") as HTMLButtonElement;

  document
    .querySelector("#pathButton")
    ?.addEventListener("click", () => openFile());

  pngButton?.addEventListener("click", () => convertImage(".png"));
  gifButton?.addEventListener("click", () => {
    isAnimated ? convertAnimatedImage() : convertImage(".gif");
  });
  jpgButton?.addEventListener("click", () => convertImage(".jpg"));
});
