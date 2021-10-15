const Handlebars = require("handlebars");

Handlebars.registerHelper(
  "createPageNumber",
  function (type, page, currentPage) {
    const currentPageIndex = currentPage - 1;
    let pagination = ``;
    for (let i = 0; i < page; i++) {
      pagination +=
        currentPageIndex === i
          ? `<li class="page-item active"><a class="page-link" href="/${type}?page=${
              i + 1
            }">${i + 1}</a></li>`
          : `<li class="page-item"><a class="page-link" href="/${type}?page=${
              i + 1
            }">${i + 1}</a></li>`;
    }
    console.log(pagination);
    return pagination;
  }
);
