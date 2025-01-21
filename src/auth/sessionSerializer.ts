import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "src/user/user.service";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) {
        super();
    }

    // Serialize user
    serializeUser(user: any, done: (err: any, user: any) => void) {
        console.log('ser',user.id);
        
        done(null, user.id); // Save user ID in the session
      }
    
      // Deserialize user
      async deserializeUser(id: any, done: (err: any, user: any) => void) {
        const theUser = await this.userService.findOneById(id); // Retrieve user by ID
        console.log('deser',theUser, id);
        
        done(null, theUser);
      }
}