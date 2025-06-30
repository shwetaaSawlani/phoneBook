"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = exports.getAllContacts = exports.toggleBookmark = exports.getContactsByLabel = exports.getContactByName = exports.deleteContactByName = exports.updateContactByName = exports.registerContact = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const Cloudinary_1 = require("../utils/Cloudinary");
const models_contact_1 = require("../models/models.contact");
const registerContact = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("inside register");
    const { name, phoneNumber, address, label } = req.body;
    if (!name || name.trim() === "") {
        throw new ApiError_1.ApiError(400, "Name is required");
    }
    if (!phoneNumber || phoneNumber.trim() === "") {
        throw new ApiError_1.ApiError(400, "Phone Number is required");
    }
    if (phoneNumber.length !== 10) {
        throw new ApiError_1.ApiError(400, "Phone Number should be exactly of 10 digits");
    }
    const avatarLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!avatarLocalPath) {
        console.error("No file path found in request");
    }
    const avatar = yield (0, Cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
    const contact = yield models_contact_1.Contact.create({
        name,
        avatar: avatar || "",
        phoneNumber,
        address,
        label
    });
    const createdContact = yield models_contact_1.Contact.findById(contact._id);
    if (!createdContact) {
        throw new ApiError_1.ApiError(500, "something went wrong while registering user");
    }
    res.status(201).json(new ApiResponse_1.ApiResponse(201, createdContact, "Contact created successfully"));
}));
exports.registerContact = registerContact;
const updateContactByName = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const { phoneNumber, address, label } = req.body;
    if (!name || name.trim() === "") {
        throw new ApiError_1.ApiError(400, "Name is required to update contact");
    }
    const contact = yield models_contact_1.Contact.findOne({ name: name });
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found with given name");
    }
    if (phoneNumber)
        contact.phoneNumber = phoneNumber;
    if (address)
        contact.address = address;
    if (label)
        contact.label = label;
    yield contact.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, "Contact updated successfully"));
}));
exports.updateContactByName = updateContactByName;
const deleteContactByName = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name || name.trim() === "") {
        throw new ApiError_1.ApiError(400, "Name is required to delete contact");
    }
    const contact = yield models_contact_1.Contact.findOneAndDelete({ name: name });
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found with given name");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Contact deleted successfully"));
}));
exports.deleteContactByName = deleteContactByName;
const getContactByName = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name || name.trim() === "") {
        throw new ApiError_1.ApiError(400, "Name is required to delete contact");
    }
    const contact = yield models_contact_1.Contact.findOne({ name });
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found with given name");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, "Contact found successfully"));
}));
exports.getContactByName = getContactByName;
const getContactsByLabel = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label } = req.params;
    if (!label || label.trim() === "") {
        throw new ApiError_1.ApiError(400, "Label is required to find contact");
    }
    const contacts = yield models_contact_1.Contact.find({ label });
    if (contacts.length === 0) {
        throw new ApiError_1.ApiError(404, "No contacts found with the given label");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contacts, "Contacts found successfully with the given label"));
}));
exports.getContactsByLabel = getContactsByLabel;
const toggleBookmark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name || name.trim() === "") {
        throw new ApiError_1.ApiError(400, "Name is required to toggle bookmark");
    }
    const contact = yield models_contact_1.Contact.findOne({ name: name });
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found");
    }
    contact.bookmarked = !contact.bookmarked;
    yield contact.save();
    res.status(200).json(contact);
}));
exports.toggleBookmark = toggleBookmark;
const getAllContacts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield models_contact_1.Contact.find();
    console.log(contact);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, "all Contacts Found!!"));
}));
exports.getAllContacts = getAllContacts;
const home = (req, res) => {
    res.send("Welcome to the home page");
};
exports.home = home;
