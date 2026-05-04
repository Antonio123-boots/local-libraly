const Author = require("../models/author");
const Book = require("../models/book");

// Display list of all Authors.
exports.author_list = async (req, res, next) => {
  try {
    const author_list = await Author.find()
      .sort({ family_name: 1 })
      .exec();

    // Add lifespan virtual to each author
    author_list.forEach((author) => {
      const birth = author.date_of_birth
        ? author.date_of_birth.getFullYear()
        : "";
      const death = author.date_of_death
        ? author.date_of_death.getFullYear()
        : "";
      author.lifespan = birth && death ? `${birth}–${death}` : "";
    });

    res.render("author_list", { title: "Author List", author_list });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
  try {
    const [author, author_books] = await Promise.all([
      Author.findById(req.params.id).exec(),
      Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
      const err = new Error("Author not found");
      err.status = 404;
      return next(err);
    }

    res.render("author_detail", {
      title: "Author Detail",
      author,
      author_books,
    });
  } catch (err) {
    next(err);
  }
};

// Display Author create form on GET.
exports.author_create_get = async (req, res, next) => {
  try {
    res.render("author_form", { title: "Create Author" });
  } catch (err) {
    next(err);
  }
};

// Handle Author create on POST.
exports.author_create_post = async (req, res, next) => {
  try {
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth || null,
      date_of_death: req.body.date_of_death || null,
    });

    // Minimal validation
    if (!author.first_name || !author.family_name) {
      return res.render("author_form", {
        title: "Create Author",
        author,
        errors: ["First name and family name are required"],
      });
    }

    await author.save();
    res.redirect(author.url);
  } catch (err) {
    next(err);
  }
};

// Display Author delete form on GET.
exports.author_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
exports.author_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
exports.author_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};