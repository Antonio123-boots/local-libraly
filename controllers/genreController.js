const Genre = require("../models/genre");
const Book = require("../models/book");

// Display list of all Genre.
exports.genre_list = async (req, res, next) => {
  try {
    const list_genres = await Genre.find()
      .sort({ name: 1 })
      .exec();

    res.render("genre_list", { title: "Genre List", list_genres });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific Genre.
exports.genre_detail = async (req, res, next) => {
  try {
    const [genre, genre_books] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (genre === null) {
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }

    res.render("genre_detail", {
      title: "Genre Detail",
      genre,
      genre_books,
    });
  } catch (err) {
    next(err);
  }
};

// Display Genre create form on GET.
exports.genre_create_get = async (req, res, next) => {
  try {
    res.render("genre_form", { title: "Create Genre" });
  } catch (err) {
    next(err);
  }
};

// Handle Genre create on POST.
exports.genre_create_post = async (req, res, next) => {
  try {
    const name = req.body.name && req.body.name.trim();
    if (!name) {
      return res.render("genre_form", {
        title: "Create Genre",
        genre: { name: '' },
        errors: ["Name is required"],
      });
    }

    let genre = await Genre.findOne({ name: name }).exec();
    if (genre) {
      // Genre exists, redirect to its detail page
      return res.redirect(genre.url);
    }

    genre = new Genre({ name });
    await genre.save();
    res.redirect(genre.url);
  } catch (err) {
    next(err);
  }
};

// Display Genre delete form on GET.
exports.genre_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};