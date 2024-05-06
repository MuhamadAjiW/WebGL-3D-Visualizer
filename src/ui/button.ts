class MaterialButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback():void {
    this.render();
  }

  static get observedAttributes() {
    return ['placeholder']
  }

  attributeChangedCallback(name:string, oldValue:string, newValue: string){
    if (name === 'placeholder'){
        this.render()
    }
  }

  render() {
    if (this.shadowRoot) {
        const placeholder = this.getAttribute('placeholder') || 'Click me!'
      this.shadowRoot.innerHTML = `
            <button>
                ${placeholder}
            </button>
          `;
    } else {
      console.error("Shadow root is null");
    }
  }
}

customElements.define("material-button", MaterialButton);
