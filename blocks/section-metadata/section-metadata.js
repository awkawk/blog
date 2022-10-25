function handleBackground(div, section) {
  const pic = div.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.textContent;
    if (color) {
      section.style.backgroundColor = color;
    }
  }
}

function handleStyle(div, section) {
  const value = div.textContent.toLowerCase();
  console.log(value);
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  if (section) {
    section.classList.add(...styles);
  }
}

export default function decorate(el) {
  const section = el.closest('.section-wrapper');
  if (!section) return;
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  keyDivs.forEach((div) => {
    console.log(div.textContent);
    const valueDiv = div.nextElementSibling;
    if (div.textContent === 'style' && valueDiv.textContent) {
      handleStyle(valueDiv, section);
    }
    if (div.textContent === 'background') {
      handleBackground(valueDiv, section);
    }
  });
}
