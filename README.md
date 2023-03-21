#TLV Airport :airplane:
##### By Or Schweitzer
Hello, this software is a web-server that gives information on inbound and outbound flights from TLV airport.


##### How to run the software?
There are two ways:

1.Use NPM & Node.js(v14.21.3) to run it locally.
  Clone project from github.
  Then in the project folder open terminal and run following commands:
  First execute `npm run build-dev` to install dependencies
  and afterwards execute `npm run dev` to run the server.

2.Use Docker.
  If you have Docker installed,
  please run the following command:
  ```
  docker run -d -p 8080:8080 ors1/tlv-flights-app
  ```  
##### Routes
1.Number of flights(GET) `http://localhost:8080/api/flights`

2.Number of outbound flights(GET) `http://localhost:8080/api/flights/outbound`

3.Number of inbound flights(GET) `http://localhost:8080/api/flights/inbound`

4.Number of delayed flights(GET) `http://localhost:8080/api/flights/delayed`

5.Most popular destination(GET) `http://localhost:8080/api/flights/popular`

6.*Bonus-* Find getaway(GET) `http://localhost:8080/api/flights/getaway` 


:clipboard: Requests of (1-3) i.e Number of flights/Number of outbound flights/Number of inbound flights can include a JSON body with  **specific country** (see example below).

```
{
    "country": "ITALY"
}
```

**Response**

For requests of (1-4) the response would be as follows:

```
{
    "totalFlights": 398
}

```

 For (5) the response would be as follows:
 ```
{
    "city": "ISTANBUL"
}
 ```
For (6) the response would be as follows:
```
    {departure: LX2526, arrival: LX257} //getaway found
    {}//not found
```

