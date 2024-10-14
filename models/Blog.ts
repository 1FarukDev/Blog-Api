import mongoose, { Document, Schema } from 'mongoose';


interface IBlog extends Document {
    title: string;
    content: string;
    excerpt: string;
    image: string;        
    authorId: mongoose.Types.ObjectId;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    authorName: string
}

const BlogSchema: Schema<IBlog> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a blog title'],
            maxlength: 200,
        },
        content: {
            type: String,
            required: [true, 'Please provide blog content'],
        },
        excerpt: {
            type: String,     
            maxlength: 500,    
        },
        image: {
            type: String,      
            required: false,   
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',       
            required: [true, 'Please provide an author'],
        },
        tags: {
            type: [String],    
            default: [],       
        },
        authorName: {
            type: String,    
            required: false       
        },
    },
    { timestamps: true }       
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
