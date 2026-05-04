const BookInstance = require("../models/bookinstance");

// Display list of all BookInstances.
exports.bookinstance_list = async (req, res, next) => {
  try {
    const bookinstance_list = await BookInstance.find()
      .populate("book")
      .exec();

    // Add formatted due_back date
    bookinstance_list.forEach((bookinstance) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      bookinstance.due_back_formatted = bookinstance.due_back
        ? bookinstance.due_back.toLocaleDateString("en-US", options)
        : "";
    });

    res.render("bookinstance_list", {
      title: "Book Instance List",
      bookinstance_list,
    });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async (req, res, next) => {
  try {
    const bookinstance = await BookInstance.findById(req.params.id)
      .populate("book")
      .exec();

    if (bookinstance === null) {
      const err = new Error("Book copy not found");
      err.status = 404;
      return next(err);
    }

    res.render("bookinstance_detail", {
      title: bookinstance.book.title,
      bookinstance,
    });
  } catch (err) {
    next(err);
  }
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = async (req, res, next) => {
  try {
    const books = await require('../models/book').find().exec();
    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
  } catch (err) {
    next(err);
  }
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = async (req, res, next) => {
  try {
    const BookInstance = require('../models/bookinstance');
    const bi = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status || 'Maintenance',
      due_back: req.body.due_back || null,
    });

    if (!bi.book || !bi.imprint) {
      const books = await require('../models/book').find().exec();
      return res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: books,
        bookinstance: bi,
        errors: ['Book and imprint are required'],
      });
    }

    await bi.save();
    res.redirect(bi.url);
  } catch (err) {
    next(err);
  }
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};