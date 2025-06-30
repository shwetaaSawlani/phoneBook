import { Request, Response} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError";
import {ApiResponse} from "../utils/ApiResponse"
import {uploadOnCloudinary} from "../utils/Cloudinary";
import {Contact} from "../models/models.contact"

const registerContact = asyncHandler(async (req:Request, res:Response)=>{
  console.log("inside register");
  
      const {name,phoneNumber,address,label}= req.body

    if(!name || name.trim() === ""){
        throw new ApiError(400, "Name is required");
    }
    if(!phoneNumber || phoneNumber.trim() === ""){
        throw new ApiError(400, "Phone Number is required");
    }
    if(phoneNumber.length !==10){
       throw new ApiError(400, "Phone Number should be exactly of 10 digits");
    }

   const avatarLocalPath = req.file?.path as string ;

if (!avatarLocalPath) {
  console.error("No file path found in request");
}
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   
   const contact = await Contact.create({
    name,
    avatar:avatar || "",
    phoneNumber,
    address,
    label
   });

   const createdContact = await Contact.findById(contact._id)

   if(!createdContact){
         throw new ApiError(500, "something went wrong while registering user")
   }
    res.status(201).json(
      new ApiResponse(201, createdContact,"Contact created successfully")
)
})

const updateContactByName = asyncHandler(async (req:Request, res:Response) => {
  const { name } = req.params;
  const { phoneNumber, address, label } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Name is required to update contact");
  }
  const contact = await Contact.findOne({ name: name });

  if (!contact) {
    throw new ApiError(404, "Contact not found with given name");
  }

  if (phoneNumber) contact.phoneNumber = phoneNumber;
  if (address) contact.address = address;
  if (label) contact.label = label;

  await contact.save();

   res.status(200).json(
    new ApiResponse(200, contact, "Contact updated successfully")
  );
});

const deleteContactByName = asyncHandler(async (req:Request, res:Response) => {
  const { name } = req.params;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Name is required to delete contact");
  }

  const contact = await Contact.findOneAndDelete({ name: name }); 

  if (!contact) {
    throw new ApiError(404, "Contact not found with given name");
  }

   res.status(200).json(
    new ApiResponse(200, {}, "Contact deleted successfully")
  );
});


const getContactByName = asyncHandler(async (req: Request, res: Response)=>{
  const {name}= req.params;
   if (!name || name.trim() === "") {
    throw new ApiError(400, "Name is required to get the contact");
  }
 const contact = await Contact.findOne({name});
 if (!contact) {
    throw new ApiError(404, "Contact not found with given name");
  }

   res.status(200).json(
    new ApiResponse(200, contact, "Contact found successfully")
  );
})

const getContactsByLabel = asyncHandler(async (req:Request, res:Response) => {
  const { label } = req.params;

  if (!label || label.trim() === "") {
    throw new ApiError(400, "Label is required to find contact");
  }

  const contacts = await Contact.find({  label });

  if (contacts.length === 0) {
    throw new ApiError(404, "No contacts found with the given label");
  }

   res.status(200).json(
    new ApiResponse(200, contacts, "Contacts found successfully with the given label")
  );
});


const toggleBookmark = asyncHandler(async (req: Request, res:Response) => {
  const { name } = req.params;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Name is required to toggle bookmark");
  }

  const contact = await Contact.findOne({ name: name });

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  contact.bookmarked = !contact.bookmarked;
  await contact.save();
  res.status(200).json(contact);
});

const getAllContacts= asyncHandler(async (req: Request, res: Response)=>{

  const contact = await Contact.find();
  console.log(contact);
      res.status(200).json(
        new ApiResponse(200, contact, "all Contacts Found!!")
      )
})


const home = (req:Request, res:Response) => {
  res.send("Welcome to the home page");
}
export {registerContact,updateContactByName,deleteContactByName,getContactByName,getContactsByLabel,toggleBookmark,getAllContacts, home}


