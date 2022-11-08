## **Introduction**:

- Currently, almost software is running stably, but users want to upgrade some functions or develop new features. After deciding to do a new function, the installation and testing process took a long time to ensure that the new function works well and matches the needs of the user, without having to change too much. After developing the new feature, we will let some users use this function, others will still use the current version of the application.
- In the process of developing new features, still ensuring the development and upgrading of old functions

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/371f93d3-707c-405f-b16a-4ad1f9088714/Untitled.png)

A simple way to do this is create a product branch that goes from the current branch and develops in parallel into 2 different products, but then managing and merging the code will be complicated and also very difficult. to manage as well as cost to develop 2 versions at the same time.
Thus we arise a requirement that allows the developer to change the operation of the application, the flow, the interface or the processing features without having to modify the code. To make it easy to imagine it as if you use facebook with many features that it is only suitable for a certain number of users, or software versions with advanced features for paid users...
The problem sounds complicated like how to determine which users are used, which functions are used or not, how data is stored and returned to ensure security and not affect the data. Current function...
However, we can divide it into many levels to implement this function such as installation at the application interface, installation at the api layer, installation at the database layer and deeper at the hardware level.

So to store this information, where will we store and it, what solution:

- Solution 1: The flags are stored in the code, each change needs to rebuild the source code and deploy to the end user, this way will cost money and effort to deploy
- Solution 2: The flags are stored in the application's config, for example, config on a web server, web hosting, app config, and env in node js code ... this way will require the user to reload the application and will be difficult to manage
- Solution 3: Self builds a feature flag system, build a flag admin portal, and the necessary services to operate a flag management page
- Solution 4: Use the feature flag service from an external service.


## Solution

### Solution 1

For basic functions or do not need to be turned on and off often, not applicable to different sets of customers, so the setting here is quite simple. You can create a flag in the source code to turn it on and off.

```jsx
function showWelcome() {

// ... old UI welcome

}

function showWelcomeV2() {

// Show UI welcome version 2, work in progress

}

// Old code before setup feature flag

function showUIWelcome() {

showWelcome() // Show UI cũ

}

// Feature flag

function showUIWelcome() {

// config feature flag SHOW_NEW_WELCOME

const SHOW_NEW_WELCOME = true;

if (SHOW_NEW_WELCOME) {

showWelcomeV2()

} else {

showWelcome()

}

}
```

### **Solution 2**

For functions that are likely to change periodically or under certain conditions that you can manage or plan, you can save those settings in an environment variable. In today's source code platforms all allow you to configure environment variables dynamically and allow to relaunch or reload environment variables dynamically. In addition, this approach is suitable for small systems, the operator has good system administration ability. However, it is important to pay attention to security requirements when setting flags as well as re-testing

- **Advantages**
    - Simple, easy to deploy with most platforms
    - Fast deployment time
    - Low deployment cost
- **Defect**
    - Limited features, It only responds to turning on and off functions in a basic way
    - Does not guarantee security requirements

**Implement guideline:**

Create config in env something like that:

```
SHOW_REFERRAL_SCREEN=true
SHOW_MENU_SCREEN=true
SHOW_RESET_SCREEN=false

```

```
function showUIRefferral() {
    if(env.SHOW_REFERRAL_SCREEN){
        // ... UI referral
    } else {
        // show UI empty
    }
}
```

### **Solution 3**

For medium to large projects with a good development team wishing to build feature flag functionality for long-term use with our products and services, the self-development option should be implemented. To develop a module like this the team will need to very clearly define the needs of the service, and analyze the fully functional design.

- **Advantages**
    - Actively develop according to demand
    - Easy to upgrade according to the design of the project
    - Our system can scale and maintain easier
    - Cost won’t increase so fast after our app has been scale
    - Developers can merge and release their new feature code without waiting too long to be merged, and user experiments won’t be affected after release ⇒ CI/CD
- **Defect**
    - Development costs
    - Functions are not rich
    - Long development time
    - Cost of personnel to operate the infrastructure system, automatically scaling

**Implement guideline:**

**Approaches**

- Implement authorization system with Module based for **none authentication** application
- Implement authorization system with Module based plus user role based if needed for **authentication** application

**Pros**

- We can easy to custom with more complex requirements later
- Easy to scale and decrease cost when compared to 3rd party

**Cons**

- Take time to init and implement in DevOps, Backend, Frontend, and Admin to manage
- With small we can’t hit deadline or we have to accept tech debt later

**What could go wrong?**

- We can take too much time to implement our own system and get results not as expected when lack resource and time

**Design own system**

**Database**

Database name: Authorization
**List of tables**

[Diagram for feature flag](https://dbdiagram.io/d/635d532f5170fb6441bbde98)

Diagram for feature flag

**System architecture**

![System diagram](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ae338ed5-12a7-4936-aeb5-521109ae1288/Untitled.png)

**Infrastructure**

**Backend**

**Database migration**

Follow the diagram above to write a migration
**API endpoint**

- CRUD for Admin
    - Need to broadcast to socket channel on each action
- **get-enabled-feature-flags** endpoint to return list to FE App based on authentication

**Socket**

- Enable socket to help FE join to channel and listen topic
- Send socket event to FE after changing anything effect to feature flag

**Middleware**

Input for middleware is a list of conditions with condition key and value, we will implement to get list of feature flags are enabled for these conditions

**Flow to get feature flags base on condition inputs**

![Screenshot 2022-11-06 at 15.16.08.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8afc1f66-c2bb-4477-bd89-29dbd8ee5c08/Screenshot_2022-11-06_at_15.16.08.png)

**Flow to check condition is true or false in detail**

![Screenshot 2022-11-06 at 15.32.17.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b62abd00-2716-4592-8d99-b09b887308df/Screenshot_2022-11-06_at_15.32.17.png)

**Example**

Old men, children, and women OR man between 20 → 40 can see feature flag A

1. Create feature flag: Name + Key
2. List and select existing triggers if not
3. Create the first trigger
    1. List variables
    
        
        
        | Name | Variable Key | Variable Type |
        | --- | --- | --- |
        | Age | age | number |
        | Sex | sex | enums |
        
    2. List condition
    
    | Name | Variable Key | Condition Type | Value |
    | --- | --- | --- | --- |
    | Children | age | less_than_to_equal | 16 |
    | Old | age | greater_than_to_equal | 60 |
    | Woman | sex | equal | woman |
    
    c. Create trigger: Name + Description + list conditions
    
4. Create the second trigger
    1. List variables
    
        
        
        | Name | Variable Key | Variable Type |
        | --- | --- | --- |
        | Age | age | number |
        | Sex | sex | enums |
        
    2. List condition
    
    | Name | Variable Key | Condition Type | Value |
    | --- | --- | --- | --- |
    | Man Min | age | less_than_to_equal | 40 |
    | Man Max | age | greater_than_to_equal | 20 |
    | Woman | sex | equal | man |
    
    c. Create trigger: Name + Description + list conditions
    
5. Add these triggers to the feature flag A

**Middleware**

1. Get information
2. Create list input conditions want to get feature flags: [{key: “age”, value: 35}, {key: “sex”, value: “man}]
3. SELECT * FROM variables v WHERE v.key in [”age”, “sex”]
4. SELECT * from conditions c WHERE c.variable_id in [variable_ids]
5. Get a list of true conditions
6. SELECT * from triggers_conditions tc WHERE tc.condition_id in [true_condition_ids]
7. Loop triggers → filter trigger has all conditions in the trigger are a subset in true_condition_ids
8. SELECT * from triggers_flags tf WHERE tt.trigger_id in [enabled_trigger_ids]
9. Return list of enabled unique feature flags