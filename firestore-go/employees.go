package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Employee struct {
	ID    string `firestore:"id"`
	Email string `firestore:"email`
	Name  string `firestore:"name"`
}
type Employees struct {
	Employees []Employee `json:"employee"`
}

var empl Employee
var emps Employees

//var employees []Employee
func getEmp(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client := createClient(ctx)
	defer client.Close()

	arr := []map[string]interface{}{}
	c1 := make(chan string, 1)
	go func() {
		// time.Sleep(2 * time.Second)
		c1 <- "Starting results"
	}()
	select {
	case res := <-c1:
		fmt.Println(res)
	case <-time.After(1 * time.Second):
		fmt.Println("Results Started")
	}
	emp, _ := client.Collection("employees").Documents(ctx).GetAll()
	c2 := make(chan time.Duration, 1)
	c3 := make(chan []map[string]interface{})
	go func() {
		start := time.Now()
		for _, doc := range emp {
			if err := doc.DataTo(&empl); err != nil {
				fmt.Println(err)
			}
			arr = append(arr, doc.Data())
		}
		t := time.Now()
		c2 <- t.Sub(start)
		c3 <- arr
	}()

	select {
	case res := <-c3:
		fmt.Println("Got all results!", res)
		fmt.Println("time to fetch results: ", <-c2)
		json.NewEncoder(w).Encode(res)
	case <-time.After(3 * time.Second):
		fmt.Println("results timed out")
	}
}
