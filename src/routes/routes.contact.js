"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_contact_js_1 = require("../controllers/controller.contact.js");
const middleware_multer_js_1 = require("../middlewares/middleware.multer.js");
const controller_contact_js_2 = require("../controllers/controller.contact.js");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API endpoints for managing contacts
 */
/**
 * @swagger
 * /api/v1/contact/register:
 *   post:
 *     summary: Register a new contact
 *     tags: [Contacts]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the contact
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the contact
 *               address:
 *                 type: string
 *                 description: Contact address
 *               label:
 *                 type: string
 *                 description: Label/category (e.g., family, work, etc.)
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file for contact avatar
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Bad request (missing or invalid fields)
 */
router.route("/register").post(middleware_multer_js_1.upload.single("avatar"), controller_contact_js_1.registerContact);
/**
 * @swagger
 * /api/v1/contact/update/{name}:
 *   put:
 *     summary: Update a contact by name
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               label:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.route("/update/:name").put(controller_contact_js_1.updateContactByName);
/**
 * @swagger
 * /api/v1/contact/delete/{name}:
 *   delete:
 *     summary: Delete a contact by name
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact name
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.route("/delete/:name").delete(controller_contact_js_1.deleteContactByName);
/**
 * @swagger
 * /api/v1/contact/get/{name}:
 *   get:
 *     summary: Get a contact by name
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact name
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 */
router.route("/get/:name").get(controller_contact_js_1.getContactByName);
/**
 * @swagger
 * /api/v1/contact/getlabel/{label}:
 *   get:
 *     summary: Get contacts by label
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: label
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact label
 *     responses:
 *       200:
 *         description: List of contacts with the given label
 */
router.route("/getlabel/:label").get(controller_contact_js_1.getContactsByLabel);
/**
 * @swagger
 * /api/v1/contact/update/bookmark/{name}:
 *   put:
 *     summary: Toggle bookmark for a contact by name
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact name
 *     responses:
 *       200:
 *         description: Bookmark status toggled successfully
 *       404:
 *         description: Contact not found
 */
router.route("/update/bookmark/:name").put(controller_contact_js_1.toggleBookmark);
router.route("/ContactList").get(controller_contact_js_2.getAllContacts);
// router.route("/register/user").post(registerUser);
// router.route("/login/user").post(login);
// router.route("/home").get(verifyUserToken, home);
// router.route("/logout").post(logout);
// router.route("/generatetoken").post(accessToken);
exports.default = router;
