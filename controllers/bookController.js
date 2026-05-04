const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

exports.index = async (req, res, next) => {
  try {
    const [
      book_count,
      book_instance_count,
      book_instance_available_count,
      author_count,
      genre_count,
    ] = await Promise.all([
      Book.countDocuments({}),
      BookInstance.countDocuments({}),
      BookInstance.countDocuments({ status: "Available" }),
      Author.countDocuments({}),
      Genre.countDocuments({}),
    ]);

    res.render("index", {
      title: "Local Library Home",
      book_count,
      book_instance_count,
      book_instance_available_count,
      author_count,
      genre_count,
    });
  } catch (err) {
    next(err);
  }
};

// Display list of all books.
exports.book_list = async (req, res, next) => {
  try {
    const book_list = await Book.find({}, "title author isbn")
      .sort({ title: 1 })
      .populate("author")
      .exec();

    res.render("book_list", { title: "Book List", book_list });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific book.
exports.book_detail = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author")
      .populate("genre")
      .exec();

    if (book === null) {
      const err = new Error("Book not found");
      err.status = 404;
      return next(err);
    }

    res.render("book_detail", { title: book.title, book });
  } catch (err) {
    next(err);
  }
};

// Display book create form on GET.
exports.book_create_get = async (req, res, next) => {
  try {
    const [authors, genres] = await Promise.all([
      Author.find().exec(),
      Genre.find().exec(),
    ]);
    res.render("book_form", { title: "Create Book", authors, genres });
  } catch (err) {
    next(err);
  }
};

// Handle book create on POST.
exports.book_create_post = async (req, res, next) => {
  try {
    // genres may come as single value or array
    let genres = req.body.genre || [];
    if (!Array.isArray(genres)) genres = [genres];

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: genres,
    });

    // Minimal validation
    if (!book.title || !book.author) {
      const [authors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
      ]);
      return res.render("book_form", {
        title: "Create Book",
        book,
        authors,
        genres: allGenres,
        errors: ["Title and author are required"],
      });
    }

    await book.save();
    res.redirect(book.url);
  } catch (err) {
    next(err);
  }
};

// Display book delete form on GET.
exports.book_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};