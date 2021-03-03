package main

import (
	"context"
	"encoding/json"
	"fmt"

	//"io/ioutil"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/go-chi/chi"
)

func userMain(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	client := createClient(ctx)
	/* if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	} */
	defer client.Close()
	m := make(map[string]interface{})
	//emp := make(map[string]interface{})
	var err error
	meth := r.Method
	fmt.Println("Method request:", meth)

	//fmt.Println("User email:", userEMAIL)
	switch {
	case meth == "GET":
		fmt.Println("Inside GET")
		userEMAIL := chi.URLParam(r, "userEmail")
		m, err = getUser(userEMAIL, client)
		json.NewEncoder(w).Encode(m)
	case meth == "OPTIONS" || meth == "POST":
		/* reqBody, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(reqBody, &emp)
		fmt.Println("User in request:", emp["email"].(string)) */
		err = loginUser(w)
	}
	fmt.Println("error:", err)
}
func loginUser(w http.ResponseWriter) error {
	ctx := context.Background()
	//sa := option.WithCredentialsFile("/tmp/keys/keyfile.json") //For local development
	//conf := &firebase.Config{ProjectID: "wesi-form", ServiceAccountID: "auth-go-identity"}
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}
	user, err := authClient.GetUserByEmail(ctx, "headquarters@goldcollarglobal.com")
	if err != nil {
		log.Fatal(err)
	}
	if user != nil {
		err := authClient.SetCustomUserClaims(ctx, user.UID, map[string]interface{}{"admin": true})
		if err != nil {
			log.Fatalf("error setting custom claims %v\n", err)
		}
	} else {
		err = authClient.SetCustomUserClaims(ctx, user.UID, map[string]interface{}{"admin": false})
		if err != nil {
			log.Fatalf("error setting custom claims %v\n", err)
		}
	}
	fmt.Println("User:", user)

	return nil
}
func getUser(uEmail string, c *firestore.Client) (map[string]interface{}, error) {
	ctx := context.Background()
	dsnap, err := c.Collection("employees").Doc(uEmail).Get(ctx)
	if err != nil {
		fmt.Println("Error getting user:", err)
	}
	data := dsnap.Data()
	fmt.Println("User:", data)
	return data, nil
}
