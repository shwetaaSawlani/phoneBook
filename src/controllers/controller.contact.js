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
exports.getAllContacts = exports.toggleBookmark = exports.getContactsByLabel = exports.getContactByName = exports.updateContactById = exports.registerContact = exports.searchContacts = exports.deleteContactById = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const Cloudinary_1 = require("../utils/Cloudinary");
const models_contact_1 = require("../models/models.contact");
const applyPaginationAndSorting = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, filter = {}) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // --- SUGGESTION 1: More Robust Input Parsing & Validation ---
    // Handle cases where page/limit might be non-numeric or negative after parsing
    if (isNaN(page) || page <= 0) {
        throw new ApiError_1.ApiError(400, "Page number must be a positive integer.");
    }
    if (isNaN(limit) || limit <= 0) {
        throw new ApiError_1.ApiError(400, "Limit must be a positive integer.");
    }
    // --- END SUGGESTION 1 ---
    const skip = (page - 1) * limit;
    try {
        const totalContacts = yield models_contact_1.Contact.countDocuments(filter);
        const contacts = yield models_contact_1.Contact.find(filter)
            .skip(skip)
            .limit(limit)
            .collation({ locale: "en" })
            .sort({
            bookmarked: -1, // Bookmarked contacts first
            name: 1 // Then by name ascending
        });
        const totalPages = Math.ceil(totalContacts / limit);
        // --- SUGGESTION 2: Handle totalPages for zero limit ---
        // If limit is 0 (which is prevented by validation now, but good for robustness)
        // or if totalContacts is 0, totalPages should be 0 or 1.
        // Math.ceil(0 / 0) is NaN. Math.ceil(0 / 10) is 0.
        // If totalContacts is 0, totalPages should ideally be 0.
        const finalTotalPages = totalContacts === 0 ? 0 : Math.ceil(totalContacts / limit);
        // --- END SUGGESTION 2 ---
        return {
            contacts,
            currentPage: page,
            totalPages: finalTotalPages, // Use the refined totalPages
            totalCount: totalContacts,
            limit,
        };
    }
    catch (error) {
        console.error("Error applying pagination and sorting:", error);
        // --- SUGGESTION 3: Provide more specific error message if it's a Mongoose error ---
        if (error.name === 'MongooseError' || error.name === 'MongoError') {
            throw new ApiError_1.ApiError(500, "Database error during pagination: " + error.message);
        }
        throw new ApiError_1.ApiError(500, "Failed to apply pagination and sorting: " + error.message);
        // --- END SUGGESTION 3 ---
    }
});
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
    const Phone = yield models_contact_1.Contact.findOne({ phoneNumber: phoneNumber });
    if (Phone) {
        throw new ApiError_1.ApiError(400, "User Already Exists with this PhoneNumber");
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
    var _a, _b, _c, _d, _e;
    const { name } = req.params;
    const phoneNumber = (_a = req.body) === null || _a === void 0 ? void 0 : _a.phoneNumber;
    const address = (_b = req.body) === null || _b === void 0 ? void 0 : _b.address;
    const label = (_c = req.body) === null || _c === void 0 ? void 0 : _c.label;
    const newName = (_d = req.body) === null || _d === void 0 ? void 0 : _d.name;
    if (!name || name.trim() === '') {
        throw new ApiError_1.ApiError(400, 'Name is required to update contact');
    }
    const contact = yield models_contact_1.Contact.findOne({ name: name });
    if (!contact) {
        throw new ApiError_1.ApiError(404, 'Contact not found with given name');
    }
    if (phoneNumber)
        contact.phoneNumber = phoneNumber;
    if (address)
        contact.address = address;
    if (label)
        contact.label = label;
    if (newName)
        contact.name = newName;
    const avatarLocalPath = (_e = req.file) === null || _e === void 0 ? void 0 : _e.path;
    if (avatarLocalPath) {
        const avatarUrl = yield (0, Cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
        contact.avatar = avatarUrl;
    }
    yield contact.save();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, contact, 'Contact updated successfully'));
}));
// const updateContactById = asyncHandler(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const phoneNumber = req.body?.phoneNumber;
//     const address = req.body?.address;
//     const label = req.body?.label;
//     const newName = req.body?.name;
//     if (!id || id.trim() === '') {
//         throw new ApiError(400, 'id is required to update contact');
//     }
//     const contact = await Contact.findOne({  _id: id  });
//     if (!contact) {
//         throw new ApiError(404, 'Contact not found with given id');
//     }
//     if (phoneNumber) contact.phoneNumber = phoneNumber;
//     if (address) contact.address = address;
//     if (label) contact.label = label;
//     if (newName) contact.name = newName;
//     const avatarLocalPath = req.file?.path as string;
//     if (avatarLocalPath) {
//         const avatarUrl = await uploadOnCloudinary(avatarLocalPath); 
//         contact.avatar = avatarUrl;
//     }
//     await contact.save();
//     res.status(200).json(new ApiResponse(200, contact, 'Contact updated successfully'));
// });
const updateContactById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { id } = req.params;
    const phoneNumber = (_a = req.body) === null || _a === void 0 ? void 0 : _a.phoneNumber;
    const address = (_b = req.body) === null || _b === void 0 ? void 0 : _b.address;
    const label = (_c = req.body) === null || _c === void 0 ? void 0 : _c.label;
    const newName = (_d = req.body) === null || _d === void 0 ? void 0 : _d.name;
    if (!id || id.trim() === '') {
        throw new ApiError_1.ApiError(400, 'Contact ID is required to update contact');
    }
    const contact = yield models_contact_1.Contact.findById(id); // Use findById for direct ID lookup
    if (!contact) {
        throw new ApiError_1.ApiError(404, 'Contact not found with the given ID');
    }
    if (phoneNumber !== undefined && phoneNumber !== null) {
        const parsedPhoneNumber = Number(phoneNumber);
        if (isNaN(parsedPhoneNumber)) {
            throw new ApiError_1.ApiError(400, 'Phone number must be a valid number.');
        }
        if (parsedPhoneNumber !== contact.phoneNumber) {
            const existingContactWithPhoneNumber = yield models_contact_1.Contact.findOne({
                phoneNumber: parsedPhoneNumber,
                _id: { $ne: id }
            });
            if (existingContactWithPhoneNumber) {
                throw new ApiError_1.ApiError(409, 'User Already Exists with this PhoneNumber');
            }
        }
        contact.phoneNumber = parsedPhoneNumber;
    }
    if (address) {
        contact.address = address;
    }
    if (label) {
        contact.label = label;
    }
    if (newName) {
        contact.name = newName;
    }
    const avatarLocalPath = (_e = req.file) === null || _e === void 0 ? void 0 : _e.path;
    if (avatarLocalPath) {
        const avatarUrl = yield (0, Cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
        contact.avatar = avatarUrl;
    }
    yield contact.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, 'Contact updated successfully'));
}));
exports.updateContactById = updateContactById;
exports.deleteContactById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || id.trim() === "") {
        throw new ApiError_1.ApiError(400, "ID is required to delete contact");
    }
    const contact = yield models_contact_1.Contact.findOneAndDelete({ _id: id });
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found with the given ID");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Contact deleted successfully"));
}));
const getContactByName = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name || name.trim() === "") {
        throw new ApiError_1.ApiError(400, "Name is required to get the contact");
    }
    const contact = yield models_contact_1.Contact.findOne({ name });
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found with given name");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, "Contact found successfully"));
}));
exports.getContactByName = getContactByName;
// export const searchContacts = asyncHandler(async (req: Request, res: Response) => {
//     const { query } = req.params;
//     if (!query || query.trim() === "") {
//         res.status(200).json(
//             new ApiResponse(200, [], "Empty search query. No results to display.")
//         );
//     }
//     const contacts = await Contact.find({
//         name: { $regex: query, $options: 'i' }
//     });
//     if (contacts.length === 0) {
//         res.status(200).json(
//             new ApiResponse(200, [], "No contacts found matching the search criteria.")
//         );
//     }
//     res.status(200).json(
//         new ApiResponse(200, contacts, "Contacts found successfully.")
//     );
// });
// const getContactsByLabel = asyncHandler(async (req: Request, res: Response) => {
//     const { label } = req.params;
//     if (!label || label.trim() === "") {
//         throw new ApiError(400, "Label is required to find contact");
//     }
//     const contacts = await Contact.find({ label }).sort({
//         name: 1
//     });
//     if (contacts.length === 0) {
//         throw new ApiError(404, "No contacts found with the given label");
//     }
//     res.status(200).json(
//         new ApiResponse(200, contacts, "Contacts found successfully with the given label")
//     );
// });
const toggleBookmark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new ApiError_1.ApiError(400, "Contact ID is required to toggle bookmark");
    }
    const contact = yield models_contact_1.Contact.findById(id);
    if (!contact) {
        throw new ApiError_1.ApiError(404, "Contact not found");
    }
    contact.bookmarked = !contact.bookmarked;
    yield contact.save();
    res.status(200).json(contact);
}));
exports.toggleBookmark = toggleBookmark;
// const getAllContacts = asyncHandler(async (req: Request, res: Response) => {
//     const contact = await Contact.find();
//     res.status(200).json(
//         new ApiResponse(200, contact, "all Contacts Found!!")
//     )
// })
// const home = (req: Request, res: Response) => {
//     res.send("Welcome to the home page");
// }
// export const getPaginatedContacts = asyncHandler(async (req: Request, res: Response) => {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     if (limit <= 0) {
//         throw new ApiError(400, "Limit must be a positive number.");
//     }
//     if (page <= 0) {
//         throw new ApiError(400, "Page number must be a positive number.");
//     }
//     const skip = (page - 1) * limit;
//     try {
//         const totalContacts = await Contact.countDocuments({});
//         const contacts = await Contact.find({})
//                                       .skip(skip)
//                                       .limit(limit)
//                                       .sort({    bookmarked: -1,name: 1 }); 
//         const totalPages = Math.ceil(totalContacts / limit);
//          res.status(200).json(
//             new ApiResponse(
//                 200,
//                 {
//                     contacts,
//                     currentPage: page,
//                     totalPages,
//                     totalCount: totalContacts,
//                     limit,
//                 },
//                 "Paginated contacts fetched successfully."
//             )
//         );
//     } catch (error: any) {
//         console.error("Error fetching paginated contacts:", error);
//         throw new ApiError(500, "Failed to fetch paginated contacts: " + error.message);
//     }
// });
exports.searchContacts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.params.query;
    const label = req.query.label;
    const filter = {};
    // --- SUGGESTION 4: Handle empty/whitespace searchTerm more gracefully ---
    // Instead of returning early with an empty list, let applyPaginationAndSorting handle it.
    // This allows pagination to still work correctly even with an empty search.
    // The current approach returns an empty list immediately, which might not be desired
    // if the user expects to see all contacts when the search bar is empty.
    // If the intention is *not* to show all contacts on empty search, then the current logic is fine.
    // Assuming the intention is to show all contacts if searchTerm is empty:
    // REMOVE THIS BLOCK if you want empty search to return all contacts (subject to label filter)
    /*
    if (searchTerm && searchTerm.trim() === "") { // Changed from !== "" to === ""
        res.status(200).json(
            new ApiResponse(200, {
                contacts: [],
                currentPage: parseInt(req.query.page as string) || 1,
                totalPages: 0,
                totalCount: 0,
                limit: parseInt(req.query.limit as string) || 10,
            }, "Empty search query. No results to display.")
        );
        return;
    }
    */
    // If you keep it, ensure `searchTerm` is trimmed before this check.
    // The frontend should already trim, but backend should always validate.
    const trimmedSearchTerm = searchTerm ? searchTerm.trim() : '';
    if (trimmedSearchTerm !== "") {
        filter.name = { $regex: trimmedSearchTerm, $options: 'i' };
    }
    // --- END SUGGESTION 4 ---
    // --- SUGGESTION 5: Robust Label Handling ---
    // Ensure label is trimmed and lowercase for comparison
    const trimmedLabel = label ? label.trim().toLowerCase() : '';
    if (trimmedLabel !== "" && trimmedLabel !== 'all') {
        filter.label = label; // Use original `label` here if case-sensitive label matching is desired in DB
        // If label in DB is stored lowercase, then filter.label = trimmedLabel;
        // If your labels are case-sensitive in the DB, `label` is fine.
        // If they are case-insensitive, you might want to consider { $regex: label, $options: 'i' } for label too.
    }
    // --- END SUGGESTION 5 ---
    const paginationResult = yield applyPaginationAndSorting(req, filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, paginationResult, "Contacts found successfully."));
}));
const getContactsByLabel = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label } = req.params;
    if (!label || label.trim() === "") {
        throw new ApiError_1.ApiError(400, "Label is required to find contact");
    }
    const filter = { label: label };
    const paginationResult = yield applyPaginationAndSorting(req, filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, paginationResult, "Contacts found successfully with the given label"));
}));
exports.getContactsByLabel = getContactsByLabel;
const getAllContacts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    const paginationResult = yield applyPaginationAndSorting(req, filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, paginationResult, "All contacts fetched with pagination and sorting."));
}));
exports.getAllContacts = getAllContacts;
