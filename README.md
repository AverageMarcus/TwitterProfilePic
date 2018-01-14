# [Twitter-Profile-Pic](https://github.com/AverageMarcus/TwitterProfilePic)

> Get a twitter profile pic using a given handle

> Live at: [https://twitter-profile-pic.marcusnoble.co.uk/](https://twitter-profile-pic.marcusnoble.co.uk/)

## Features

* Multiple image size support (currently supported: `normal`, `bigger`, `mini`, `original`, `200x200`, `400x400`)
* JSON support using `application/json` content type header
* Returns a default profile pic for unknown users

## Example: HTML

Code:
```
<img src="https://twitter-profile-pic.jsoxford.com/marcus_noble_?size=normal" />
```
Result:

![](https://twitter-profile-pic.jsoxford.com/marcus_noble_?size=normal)

## Example: JSON
cURL Request:
```
curl -X GET \
  https://twitter-profile-pic.marcusnoble.co.uk/marcus_noble_ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 680d968e-9b13-85c8-f7d5-9b48a333702f'
```

Result:
```
{
    "normal": "https://pbs.twimg.com/profile_images/776738772759277569/hfaM5zhA_normal.jpg",
    "bigger": "https://pbs.twimg.com/profile_images/776738772759277569/hfaM5zhA_bigger.jpg",
    "mini": "https://pbs.twimg.com/profile_images/776738772759277569/hfaM5zhA_mini.jpg",
    "original": "https://pbs.twimg.com/profile_images/776738772759277569/hfaM5zhA.jpg",
    "200x200": "https://pbs.twimg.com/profile_images/776738772759277569/hfaM5zhA_200x200.jpg",
    "400x400": "https://pbs.twimg.com/profile_images/776738772759277569/hfaM5zhA_400x400.jpg"
}
```
