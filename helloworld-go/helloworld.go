package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go"
)

type User struct {
	uid string
}

var user User

func handler(w http.ResponseWriter, r *http.Request) {
	log.Print("helloworld: received a request")
	target := os.Getenv("TARGET")
	if target == "" {
		target = "World"
	}
	fmt.Fprintf(w, "Hello %s!\n", target)
}
func getCurrentUser(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)

	if err := json.Unmarshal([]byte(reqBody), &user); err != nil {
		fmt.Println("Error unmarshalling: ", err)
	}
	fmt.Println(user.uid)
}
func authenticateUser() (bool, error) {
	ctx := context.Background()
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	claims := map[string]interface{}{"admin": true}
	err = client.SetCustomUserClaims(ctx, user.uid, claims)
	if err != nil {
		log.Fatalf("error setting custom claims %v\n", err)
	}
	user, err := client.GetUser(ctx, user.uid)
	if err != nil {
		log.Fatal(err)
	}
	var ok bool
	if admin, ok := user.CustomClaims["admin"]; ok {
		if admin.(bool) {
			fmt.Println("admin:", admin)
		}
	}
	return ok, nil
}
func main() {
	/* audience := "https://helloworld-wsaanm77nq-ue.a.run.app"
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	// Create token
	ts, err := idtoken.NewTokenSource(ctx, audience)
	if err != nil {
		log.Fatal("idtoken.NewTokenSource:", err)
	}
	token, err := ts.Token()
	fmt.Println("main token:", token)
	if err != nil {
		log.Fatal("TokenSource.Token:", err)
	}
	req, err := http.NewRequest(http.MethodGet, audience, nil)
	if err != nil {
		log.Fatal("RenderService.NewRequest:", err)
	}
	token.SetAuthHeader(req)
	fmt.Println("main req:", req.Header) */
	security, err := authenticateUser()
	if err != nil {
		log.Fatalf("error getting user: %v\n", err)
	}

	fmt.Println("is signed in:", security)
	if !security {
		return
	}
	log.Print("helloworld: starting server...")

	http.HandleFunc("/", handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("helloworld: listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
