class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    // /tours?duration[gte]=5 -> { duration: { gte: 5 } }

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // we temporarily turn the query object into
    // string to add "$" to operators (>,>=,<,<=)
    let queryStr = JSON.stringify(queryObj);

    // Replace: /tours?duration[gte]=5 -> /tours?duration[$gte]=5
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // \b - match exacts words: "gte", "gt", "lte", "lt", not just part of word
    // g - all instances to be replaced

    this.query = this.query.find(JSON.parse(queryStr));

    // class instance object has to be returned so that
    // other methods could be chained
    return this;
  }

  sort() {
    // /tours?sort=-price
    // would sort documents in descending order of price
    if (this.queryString.sort) {
      // multiple query values e.g /tours?sort=-price,ratingsAverage
      // are initally read as one string - { sort: '-price,ratingsAverage' }
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('name');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      // we exclude that field bc it's no use to the user
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
