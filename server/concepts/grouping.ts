/// TODO

import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError } from "./errors";

export interface GroupDoc extends BaseDoc {
  groupName: string;
  members: ObjectId[];
  boards: ObjectId[];
  admin: ObjectId;
}

export interface GroupInviteDoc extends BaseDoc {
    from: ObjectId;
    to: ObjectId;
    groupName: string;
    status: "pending" | "rejected" | "accepted";
  }

/// I have decided to make my groups run only on invites.
export interface GroupRequestDoc extends BaseDoc {
    requestee: ObjectId;
    groupName: string;
    status: "pending" | "rejected" | "accepted";
  }

export default class GroupingConcept {
    public readonly groups: DocCollection<GroupDoc>;
    public readonly invites: DocCollection<GroupInviteDoc>;
    public readonly requests: DocCollection<GroupRequestDoc>;

    constructor(collectionName: string) {
        this.groups = new DocCollection<GroupDoc>(collectionName)
        this.invites = new DocCollection<GroupInviteDoc>(collectionName + "_invites")
        this.requests = new DocCollection<GroupRequestDoc>(collectionName + "_GRequests")
    }

    async getGroupAdmin(object: ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        return group.admin
    }

    async createGroup(groupName: string, creator: ObjectId) {
        const isGroup = await this.groups.readOne( {groupName} )
        if (isGroup) {throw new NotAllowedError("This group name is already taken.")}
        return await this.groups.createOne({ groupName, members: [], boards: [], admin: creator })
    }

    async disbandGroup(groupName: string, requestor: ObjectId) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        if (requestor !== group.admin) {
            throw new NotAllowedError("Requestor does not possess admin priveleges over this group.")
        }
        return await this.groups.deleteOne({ groupName });
    }

    async invite(from:ObjectId, to:ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        if (from !== group.admin) {
            throw new NotAllowedError("Requestor does not possess admin priveleges over this group.")
        }
        if (group.members.includes(to)) {throw new NotAllowedError("The group already contains this member.")}
        return this.invites.createOne({from, to, groupName, status: "pending"})
    }

    async revokeInvite(from:ObjectId, to:ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        if (from !== group.admin) {
            throw new NotAllowedError("Requestor does not possess admin priveleges over this group.")
        }
        return this.invites.deleteOne({from, to, groupName, status: "pending"})
    }

    async acceptInvite(user:ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        const invite = await this.invites.readOne({to: user, groupName})
        if (!invite) { throw new NotAllowedError("You do not have an invite to this group.")}
        await this.invites.partialUpdateOne({to: user, groupName}, {status: "accepted"})
        const mem = group.members.concat([user]) 
        return await this.groups.partialUpdateOne({groupName}, {members: mem})
        
    }
    
    async rejectInvite(user:ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        const invite = await this.invites.readOne({to: user, groupName})
        if (!invite) { throw new NotAllowedError("You do not have an invite to this group.")}
        await this.invites.partialUpdateOne({to: user, groupName}, {status: "rejected"})
    }

    async getUserInvites(user: ObjectId) {
        return await this.invites.readMany({ to: user });
      }

    async getGroupInvites(user: ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        if (user !== group.admin) {
            throw new NotAllowedError("Requestor does not possess admin priveleges over this group.")
        }
        return await this.invites.readMany({ groupName });
      }

    async createGroupBoard(user: ObjectId, object: ObjectId, groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        if (user !== group.admin) {
            throw new NotAllowedError("Requestor does not possess admin priveleges over this group.")
        }
        const boards = group.boards.concat([object])
        return await this.groups.partialUpdateOne({groupName}, {boards})
    }

    async deleteGroupBoard() {

    }
    

    async getMembers(groupName: string) {
        const group = await this.groups.readOne({ groupName });
        if (!group) { throw new BadValuesError("This group does not exist:", + groupName)}
        return group.members
    }


}


