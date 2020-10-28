# CheckMeIn

## Website : https://vast-castle-02121.herokuapp.com/

## Video Demo: https://youtu.be/BW6BrORjWnE

## Inspiration

In the present COVID-19 pandemic situation, maintaining safe social distance in public spaces is a primary requirement to avoid the spread of the virus. To avoid crowding at stores/establishments businesses are limiting the number of people allowed at a time in store; however this leads to the possibility of long queues outside a store waiting to get in, which beats the cause of social distancing. I built this application to convert the physical queue into a digital queue - **social distancing achieved!**

## What it does

 This application allows a user to search for his/her favorite places ( restaurants, museums, car wash, etc.) nearby and find matching merchants/establishments along with their available queue (given each merchant's capacity). 
 
 User can choose to check in to the merchant of choice and keep track of their position in the queue before heading out to the store. After the user checks out, all users in queue gets their position updated!

This application an interface for a merchant to register his establishment by searching on google maps. After a merchant has registered, he/she can also track the users checked in to their store presently.

1. **Channels**
    - This app provides two different channels 
        - One for a merchant to register his establishment           
        - Another for user to find nearby merchants to check in to their favorite places.

2. **Merchant Registration** 
     - The application uses google maps API platform to allow a merchant to search for his/her establishment on google maps, and it auto fills the establishment's details like, address, opening hours, rating, contact info, etc.
    - The merchant will just need to input the number of people allowed at a time as the limit

    - The categories of merchants are based on the categories Google Maps uses to tag the establishments (~98 categories) 

3. **User Registration**
    - Users can register using a email and only a user name and unique email address is required to register on the application
    - The app seeks for geo-location permissions to better guide the merchants on their nearby favorite places

4. **Finding Favorite Places**
    - Once a user logs in, entire collection merchants across all categories within 50 miles will be displayed to the user 
    - The application provides two filters:
        - Choose the category of their favorite places (out of 98 recognized categories by Google Maps platform)
        - Choose the radial scope of search in terms of miles (e.g. 5, 10, 20, 50 miles) 
    - Based on user choices, a filtered collection of merchants will be displayed with markers available on map
    - Following merchant details are displayed to the user:
        - Store Name
        - Full Address
        - Contact no.
        - Upon zooming on a merchant card, more details are shown:
            - Operating Hours
            - **Limit on no. of people allowed at the store at a time**
            - **No. of customers already in the queue for the store**
            - Rating
            - Website link
            - Google maps URL link
            - Category of merchant
        - **Availability of checking in , i.e. if no. of people already in queue is less than store limit , user has a button to check-in**
        - **If the queue is larger than the store limit, the user can still check in, but it will notified that the queue is more than the limit**. This enables user to make a prudent decision before heading on to their favorite place
5. **Checking in to the store**    
    - Once the user clicks on `Check In` button, it puts the user name and checking in time stamp to the merchant queue, and also adds to the the list of checked-in merchants by the user.
    - User is provided with a queue position as per the last recorded position in the backend server
    - Once a user refreshes his page , the latest queue position is updated
    - Also, **if an user from ahead of the queue checks out while the present user is logged in, his/her queue position gets updated in real time** , this is done using web sockets to emit a event to all signed up users in the 'room' whenever another user checks out
    - After clicking the `Check In` button, the user is provided with a `Check Out` button at the same place, which he/she can click to check out once the services are availed, or if he/she wants to quit the queue earlier

6. **Finding users in queue - Merchant side**
    - Once a merchant has registered, he will be present with the `Add store details` page as the landing page
    - If the merchant has already added store details, he/she can directly visit the "Users in Queue" link to find the list of users (with username, checking in time) presently checked into the queue for the store.
    - This shall help the merchant to plan his/her store timings, resources in advance
    - The merchant can use the `Add store details` page to update their address and/or limits of customers in store as per the latest requirements



## How I built it

This application is built using :
- Node.js to build the backend server environment, along with ExpressJS framework to design the backend   application layer 
- MongoDB as database to store the user and merchant details, and also to handle the two queues:
    - For a merchant , a queue for users checked in to the store
    - For a user, a list merchants that the user has presently checked in
- React (to check the client side code check `frontend` directory) library to design the client end interface which is the served as static build
- [Socket.IO](https://www.npmjs.com/package/socket.io) library is used to send real time updates of user queue position changes to all users checked in to the respective merchants
- [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api) library is used to provide the google map to the user and the merchant. Also, Google Places, Autocomplete search libraries are used for better  
- [Maps Javacript API](https://developers.google.com/maps/documentation/javascript/examples/place-details#maps_place_details-javascript) is used in back-end to fetch the merchant store details using geocoding and nearby places search
- [bcryptjs](https://www.npmjs.com/package/bcrypt) library is used to salt hash the user passwords and authenticate the user upon login securely
- React hooks useState, useEffect and useContext are used to effectively create a single page application through maintaining (useState) , refreshing (useEffect) and sharing data (useContext) amongst component states

## Challenges I ran into
- The initial challenge was to set up the two separate channels of interface and data flow for the application.
    - The merchant and user interfaces and backend routing are to be discrete
    - And still these two channels needs to communicate with each other in terms of :
        - user finding the list of registered merchants near by  
        - queuing into a merchant, and getting the updated queue position from the merchant in real time 
- The schema design was interesting such that some of user and merchant details are to be preserved discretely, and both merchant and users have queue (array of users/merchants) embedded in their list
- Since, the queue of users shall change in size dynamically, a noSQL database like mongoDB was the right fit
- Following schemas were designed for this:
    - **Merchant schema** : Holding merchant registration and store details (address, contact, rating, map url, limits on #customers allowed a time)
    - **UsersInQueue schema** : This schema is embedded in `Merchant` schema as an array which is used to maintain user details ( name and checking in timestamp) as a queue
    - **User schema** : This schema holds the user registration information and the list of merchants the user has presently checked in
    - **MerchantsChecked** schema : This schema is embedded in `User` schema as an array which is used to maintain the list of merchants the user has presently signed in

- The major challenge was designing the routes, i.e. both authentication and data flow routes for merchants and users
    - For user, one merchant route is accessed to get the list of nearby registered merchants from the backend database every time user loads the home page
    - Both merchant and user routes are inter-operated to **update the users in queue for a merchant in the database, whenever a user `Checks In` to the merchant**  , and to update the `Checked In Merchants` list for the user in database simultaneously
    - Since, **the backend queue is simply an array, implementing a queue logic on both backend and client side was challenging to achieve**
    - Every time user refreshes the page, the merchants' users in queue indexes are fetched to update the client with the latest position changes

- Also, to send real time updates to the users about queue position changes, sockets were essential. 
    - Putting all users in a room , where server can send an update whenever any user **checks out** 
    - Subsequently, implementing the client side logic to find the merchant name & position of the checked out user in order to update the queue position for the user , was a challenging task as well

- In client side development:
    - Multiple contexts are to be maintained for all components to share, e.g. list of all merchants context, users in queue context, checked-in merchants context, etc. 
    -Client side is served as static file build. To check client side components, check the `frontend` folder uploaded
    - **Multiple asynchronous events were to be handled**, and each update needs to be shared across components - useState and useContext hooks were crucial to solve this issue

## What I learned

Besides getting more coding proficiency in full stack web development , this project helped me learn the following techniques / skills
- Designing effective routing in backend and client side two maintain two channels of interface and data flow
- Designing effective data schema for noSQL databases
- Learning to use Google Maps javascript API libraries, which I can use effectively in future projects
- Using web sockets for real time bidirectional communication between server and client
- Designing better client components which maintain and share their state and context information effectively - resulting in an efficient Single Page Application
- A more responsive UI design 

## What's next for OneStorage
- Providing option for auto expiration of checked in queues after a certain period of time, if user forgets to check out
- Providing for web push & SMS notifications for users to get latest update on their queue positions once they have checked into a merchant
- Providing merchant an option to check out a customer on customer's behalf to avoid longer queues owing to checked in customers not showing up
- Allowing merchants to view and download summary level statistics and logs of customer check ins, which will enable the merchant to better plan their store hours and store capacity   

## Built With
- Node.js
- Express.js
- MongoDB
- React






    








