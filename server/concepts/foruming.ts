///TODO

import { ObjectId } from "mongodb";
import { BaseDoc } from "../framework/doc";

export interface ForumDoc extends BaseDoc {
    forumName: String,
    forumContent: string[]
    forumFollowers: ObjectId[]
  }