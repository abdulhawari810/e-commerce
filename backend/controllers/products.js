import {
  ProductsModel,
  ProductsDetailModel,
  ProductTagModel,
  ProductTagRelationship,
} from "../models/relationship.js";
import slugify from "slugify";
import { fn, col, where, Op } from "sequelize";
import ActivityLogModel from "../models/ActivityLogsModel.js";
import { Parser } from "json2csv";

export const getProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await ProductsModel.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      include: {
        model: ProductsDetailModel,
        as: "detail",
      },
    });

    let error = null;

    if (rows?.length === 0) {
      error = { message: "Product not Found", code: 404 };
    }

    if (error) {
      return res
        .status(error.code)
        .json({ error: true, code: error.code, message: error.message });
    }

    res.status(200).json({
      message: "Product Berhasil didapatkan!",
      code: 200,
      product: rows,
      pagination: {
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const SearchProduct = async (req, res) => {
  try {
    const search = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const normalizedSearch = search.trim();

    let whereCondition = null;

    if (normalizedSearch) {
      const keywords = normalizedSearch.split(/\s+/);
      const isNumber = /^\d+$/.test(normalizedSearch);

      whereCondition = {
        [Op.and]: [
          ...keywords.map((word) => ({
            [Op.or]: [
              { judul: { [Op.like]: `%${word}%` } },
              { tipe: { [Op.like]: `%${word}%` } },
              { status: { [Op.like]: `%${word}%` } },
            ],
          })),
          ...(isNumber
            ? [
                {
                  [Op.or]: [
                    { harga: Number(normalizedSearch) },
                    { diskon: Number(normalizedSearch) },
                    { stok: Number(normalizedSearch) },
                  ],
                },
              ]
            : []),
        ],
      };
    }

    const { count, rows } = await ProductsModel.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      ...(whereCondition && { where: whereCondition }),
      include: [
        {
          model: ProductsDetailModel,
          as: "detail",
          required: false,
        },
      ],
    });

    if (!rows.length) {
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Produk tidak ditemukan!",
      });
    }

    res.status(200).json({
      success: true,
      code: 200,
      product: rows,
      pagination: {
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      code: 500,
      message: error.message,
    });
  }
};

export const getProductByFilter = async (req, res) => {
  try {
    const { colors, size, hargaMurah, hargaMahal, diskon, judul } = req.body;

    const whereProduct = {};
    const whereDetail = {};
    const order = [];

    if (hargaMurah && hargaMahal) {
      whereProduct.harga = {
        [Op.between]: [hargaMurah, hargaMahal],
      };
    } else if (hargaMurah) {
      whereProduct.harga = {
        [Op.gte]: hargaMurah,
      };
    } else if (hargaMahal) {
      whereProduct.harga = {
        [Op.lte]: hargaMahal,
      };
    }

    if (diskon) {
      whereProduct.diskon = {
        [Op.gte]: diskon,
      };
    }

    if (judul) {
      whereProduct.judul = {
        [Op.like]: `%${judul.toLowerCase()}%`,
      };
    }

    if (size) {
      whereDetail[Op.and] = whereDetail[Op.and] || [];
      whereDetail[Op.and].push(
        where(fn("LOWER", col("detail.size")), {
          [Op.like]: `%${size.toLowerCase()}%`,
        })
      );
    }

    if (colors) {
      whereDetail[Op.and] = whereDetail[Op.and] || [];
      whereDetail[Op.and].push(
        where(fn("LOWER", col("detail.colors")), {
          [Op.like]: `%${colors.toLowerCase()}%`,
        })
      );
    }

    const product = await ProductsModel.findAll({
      where: whereProduct,
      include: {
        model: ProductsDetailModel,
        as: "detail",
        where: whereDetail,
        required: true,
      },
      order,
    });

    if (product.length === 0)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Produk tidak ditemukan!",
      });

    res.status(200).json({
      success: true,
      code: 200,
      message: "Product Berhasil didapatkan",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductsModel.findOne({
      where: {
        id,
      },
      include: {
        model: ProductsDetailModel,
        as: "detail",
      },
    });

    if (!product)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Product Not Found!" });

    res.status(200).json({
      success: true,
      code: 200,
      message: "Product Berhasil ditemukan!",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  const user = req.user;
  try {
    const {
      judul,
      harga,
      thumbnail,
      stok,
      diskon,
      tipe,
      desc,
      colors,
      size,
      sku,
      image_detail,
      material,
      model,
      fit,
      weight,
      gender,
      feature,
    } = req.body;

    const product = await ProductsModel.findOne({
      where: {
        judul,
      },
    });

    let error = [];
    const slug = slugify(judul, {
      replacement: "-",
      lower: true,
      remove: undefined,
      strict: false,
      locale: "id",
      trim: true,
    });

    if (product) {
      error.push("Produk sudah ditambahkan");
    }

    if (error.length > 0) {
      return res.status(403).json({ error: true, code: 403, message: error });
    }

    const query = await ProductsModel.create({
      judul,
      slug,
      harga: parseInt(harga),
      stok: parseInt(stok),
      tipe,
      diskon: parseInt(diskon),
      thumbnail,
    });

    await ProductsDetailModel.create({
      productId: query.id,
      colors,
      size,
      image_detail,
      sku,
      desc,
      material,
      weight,
      gender,
      feature,
      model,
      fit,
    });

    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const descLogs = `${user.username} Menambahkan Produk ${judul} pada ${day}-${month}-${year}`;
    const titleLogs = `Menambahkan Sebuah Produk`;
    await ActivityLogModel.create({
      title: titleLogs,
      description: descLogs,
      status: "success",
      tipe: "products",
    });

    await res.status(201).json({
      success: true,
      code: 201,
      message: "Product Created SuccessFully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAllProduct = async (req, res) => {
  try {
    const data = req.body;

    //return res.json({ data });

    for (const d of data) {
      const judul = d.judul;
      const harga = d.harga;
      const thumbnail = d.thumbnail;
      const status = d.status;
      const tipe = d.tipe;
      const diskon = d.diskon;
      const stok = d.stok;

      const colors = d.colors;
      const size = d.size;
      const sku = d.sku;
      const desc = d.desc;
      const image_detail = d.image_detail;
      const material = d.material;
      const model = d.model;
      const fit = d.fit;
      const feature = d.feature;
      const weight = d.weight;
      const gender = d.gender;

      const slug = slugify(judul, {
        replacement: "-",
        lower: true,
        remove: undefined,
        strict: false,
        locale: "id",
        trim: true,
      });

      const product = await ProductsModel.findOne({
        where: {
          judul,
        },
      });

      if (product)
        return res.status(403).json({
          error: true,
          code: 403,
          message: "Product ini sudah ditambahkan",
        });

      const query = await ProductsModel.create({
        slug,
        judul,
        harga,
        stok,
        thumbnail,
        status,
        tipe,
        diskon,
      });

      await ProductsDetailModel.create({
        productId: query.id,
        colors,
        size,
        image_detail,
        sku,
        desc,
        material,
        weight,
        gender,
        feature,
        model,
        fit,
      });
    }
    res.status(201).json({
      success: true,
      code: 201,
      message: "Product Created SuccessFully!",
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul,
      harga,
      thumbnail,
      stok,
      diskon,
      tipe,
      desc,
      colors,
      size,
      sku,
      image_detail,
      material,
      weight,
      gender,
      feature,
      model,
      fit,
    } = req.body;

    const slug = slugify(judul, {
      replacement: "-",
      lower: true,
      remove: undefined,
      strict: false,
      locale: "id",
      trim: true,
    });

    const product = await ProductsModel.findOne({
      where: {
        id,
      },
      include: {
        model: ProductsDetailModel,
        as: "detail",
      },
    });

    if (!product)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Produk tidak ditemukan!" });

    await ProductsModel.update(
      {
        judul,
        slug,
        harga,
        stok,
        tipe,
        diskon,
        thumbnail,
      },
      {
        where: { id },
      }
    );

    await ProductsDetailModel.update(
      {
        colors,
        size,
        image_detail,
        sku,
        desc,
        material,
        weight,
        gender,
        feature,
        model,
        fit,
      },
      {
        where: { productId: id },
      }
    );

    res
      .status(200)
      .json({ success: true, code: 200, message: "Produk Berhasil diupdate!" });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductsModel.findOne({
      where: {
        id,
      },
    });

    if (!product)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Produk tidak ditemukan!" });

    await ProductsModel.destroy({
      where: {
        id,
      },
    });

    res
      .status(200)
      .json({ success: true, code: 200, message: "Produk Berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};

export const createTagsProduct = async (req, res) => {
  try {
    const { productId, tagId } = req.body;

    const tag = await ProductTagModel.findByPk(tagId);
    if (!tag) {
      return res.status(400).json({
        error: true,
        message: "Tag tidak ditemukan",
      });
    }

    const product = await ProductsModel.findByPk(productId);
    if (!product) {
      return res.status(400).json({
        error: true,
        message: "Produk tidak ditemukan",
      });
    }

    await ProductTagRelationship.create({
      productTagId: productId,
      tagId,
    });

    res.status(201).json({
      error: true,
      code: 201,
      message: "Produk berhasil ditambah ke dalam daftar kategori!",
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};

export const getTagsProduct = async (req, res) => {
  try {
    const { tagId } = req.params;

    const existingProductTags = await ProductTagModel.findAll({
      where: {
        id: tagId,
      },
      include: [
        {
          model: ProductsModel,
          as: "products",
          through: { attributes: [] },
        },
      ],
      order: [[{ model: ProductsModel, as: "products" }, "id", "DESC"]],
    });

    if (!existingProductTags)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Produk Tidak ditemukan!" });

    res.status(200).json({
      error: true,
      code: 200,
      message: "Produk berhasil ditemukan!",
      product: existingProductTags,
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};

export const exportProductCSV = async (req, res) => {
  const products = await ProductsModel.findAll();

  const fields = [
    "id",
    "judul",
    "harga",
    "stok",
    "tipe",
    "diskon",
    "status",
    "createdAt",
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(products);

  res.header("Content-Type", "text/csv");
  res.attachment("products.csv");
  return res.send(csv);
};
