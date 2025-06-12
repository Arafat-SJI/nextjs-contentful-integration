'use client'
import React from 'react'
import { useState } from "react"
import Image from "next/image"
import { Calendar, User } from "lucide-react"

// Types for Contentful data structure
interface ContentfulImage {
  fields: {
    file: {
      url: string
      details: {
        image: {
          width: number
          height: number
        }
      }
    }
    title: string
  }
}

interface Author {
  fields: {
    authorName: string
    profile: ContentfulImage
  }
}

interface RichTextNode {
  nodeType: string
  content?: RichTextNode[]
  value?: string
  marks?: Array<{ type: string }>
}

interface PostBody {
  content: RichTextNode[]
}

interface BlogPost {
  postTitle: string
  postBody: PostBody
  thumbnail: ContentfulImage
  author: Author
  publicationDate: string
}

interface BlogPostCardProps {
  post: BlogPost
}

// Helper function to extract plain text from rich text content
function extractPlainText(content: RichTextNode[], maxLength = 200): string {
  let text = ""

  function traverse(nodes: RichTextNode[]) {
    for (const node of nodes) {
      if (node.nodeType === "text" && node.value) {
        text += node.value
      } else if (node.content) {
        traverse(node.content)
      }

      if (text.length >= maxLength) break
    }
  }

  traverse(content)
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function BlogPostCard({ post }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false)
  const [authorImageError, setAuthorImageError] = useState(false)

  const { postTitle, postBody, thumbnail, author, publicationDate } = post
  const excerpt = extractPlainText(postBody.content)
  const imageUrl = thumbnail.fields.file.url.startsWith("//")
    ? `https:${thumbnail.fields.file.url}`
    : thumbnail.fields.file.url

  const authorImageUrl = author.fields.profile.fields.file.url.startsWith("//")
    ? `https:${author.fields.profile.fields.file.url}`
    : author.fields.profile.fields.file.url

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-md border border-gray-200">
      {/* Image Header */}
      <div className="relative aspect-video overflow-hidden">
        {!imageError ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={thumbnail.fields.title || postTitle}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">{postTitle}</h3>

          {/* Excerpt */}
          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{excerpt}</p>

          {/* Author and Date */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {!authorImageError ? (
                  <img
                    src={authorImageUrl || "/placeholder.svg"}
                    alt={author.fields.authorName}
                    className="h-full w-full object-cover"
                    onError={() => setAuthorImageError(true)}
                  />
                ) : (
                  <User className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-900">{author.fields.authorName}</span>
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(publicationDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const GenericSection = ({ data }: any) => {
  function getPostArray(datas: any) { 
    let postArray = null;
    if(datas?.length > 0) {
      postArray = datas?.map((item: any) => {
        // Extract the fields from the Contentful entry structure
        const fields = item?.fields;
        
        return {
          postTitle: fields?.postTitle,
          postBody: fields?.postBody,
          thumbnail: fields?.thumbnail,
          author: fields?.author,
          publicationDate: fields?.publicationDate
        };
      });
    }
    return postArray;
  }

  return (
    <div>{JSON.stringify(getPostArray(data?.fields?.firstColumn[0]?.fields?.post).map((post: any, index: number) => (
      <BlogPostCard key={index} post={post} />
    )))}</div>
  )
}

export default GenericSection