// tree.ts
interface TreeItem {
  href: string;
  label: string;
  children: TreeItem[];
  icon: null;
}

const treeItems: TreeItem[] = [
  {
    href: "#",
    label: "Children 1",
    children: [
      { href: "#", label: "Grand Children 1", children: [], icon: null },
      { href: "#", label: "Grand Children 2", children: [], icon: null },
      { href: "#", label: "Grand Children 3", children: [], icon: null },
      { href: "#", label: "Grand Children 4", children: [], icon: null },
    ],
    icon: null,
  },
  {
    href: "#",
    label: "Children 2",
    children: [
      { href: "#", label: "Grand Children 5", children: [], icon: null },
      { href: "#", label: "Grand Children 6", children: [], icon: null },
      { href: "#", label: "Grand Children 7", children: [], icon: null },
      { href: "#", label: "Grand Children 8", children: [], icon: null },
    ],
    icon: null,
  },
  {
    href: "#",
    label: "Children 3",
    children: [
      { href: "#", label: "Grand Children 9", children: [], icon: null },
      { href: "#", label: "Grand Children 10", children: [], icon: null },
      { href: "#", label: "Grand Children 11", children: [], icon: null },
      { href: "#", label: "Grand Children 12", children: [], icon: null },
    ],
    icon: null,
  },
  {
    href: "#",
    label: "Children 4",
    children: [
      {
        href: "#",
        label: "Grand Children 13",
        children: [
          {
            href: "#",
            label: " Grand Grand Children 1",
            children: [],
            icon: null,
          },
        ],
        icon: null,
      },
      { href: "#", label: "Grand Children 14", children: [], icon: null },
      { href: "#", label: "Grand Children 15", children: [], icon: null },
      { href: "#", label: "Grand Children 16", children: [], icon: null },
    ],
    icon: null,
  },
];

const treeDiv = document.getElementById("tree") as HTMLDivElement;

function createTree(
  treeItems: TreeItem[],
  parentElement: HTMLElement,
  level: number
) {
  const ul = document.createElement("ul");
  ul.className = level > 0 ? "ml-4" : "";

  treeItems.forEach((item, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    link.style.fontWeight = item.children && item.children.length > 0 ? "bold" : "normal"; 
    li.appendChild(link);

    if (item.children && item.children.length > 0) {
      const icon = document.createElement("span");
      icon.textContent = "►";
      icon.style.cursor = "pointer";
      icon.style.marginRight = "5px";
      li.insertBefore(icon, link);

      createTree(item.children, li, level + 1);
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        const childUl = li.querySelector("ul");
        if (childUl) {
          const isVisible = childUl.style.display !== "none";
          childUl.style.display = isVisible ? "none" : "";
          icon.textContent = isVisible ? "►" : "▼"; 
        }
      });
    }

    ul.appendChild(li);
  });

  parentElement.appendChild(ul);
}

createTree(treeItems, treeDiv, 0);
