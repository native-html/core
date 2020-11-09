export const href = 'https://domain.com';
export const secondaryHref = 'https://sub.domain.com';
export const imgSrc = 'https://domain.com/logo.jpg';
export const rfc002Source = `<a href="${href}">
This is
<span>phrasing content</span>
<img src="${imgSrc}" />
    and this is <strong>too</strong>.
</a>`;

export const nestedHyperlinksSource = `<a href="${href}">
This is
<span>phrasing content</span> <a href="${secondaryHref}">and this is <strong>too</strong></a>
</a>`;

export const deeplyNestedSource = `<article>
First implicit paragraph.
<div>
  Second implicit paragraph
  <p>
    A new paragraph.
    <span> And a span within</span>
    <img src="${imgSrc}" />
  </p>
</div>
</article>`;

export const recursiveHoisting = `<span>
  Line1
  <strong>
    Line2
    <span> Line3</span>
    <img src="${imgSrc}" />
  </strong>
</span>`;
