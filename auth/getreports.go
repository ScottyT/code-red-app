package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/go-chi/chi"
)

func reportsList(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client := createClient(ctx)
	defer client.Close()
	dispatchiter, _ := client.Collection("dispatch-reports").Documents(ctx).GetAll()    //client.Collection("dispatch-reports").Documents(ctx)
	rapiditer, _ := client.Collection("rapid-response-reports").Documents(ctx).GetAll() //client.Collection("rapid-response-reports").Documents(ctx)
	//timeout := time.After(time.Duration(80) * time.Millisecond)
	//reportsArr := append(dispatchiter, rapiditer)
	arr := []map[string]interface{}{}

	for _, doc := range dispatchiter {
		m := make(map[string]interface{})
		m["ArrivalContactName"] = doc.Data()["ArrivalContactName"]
		arr = append(arr, doc.Data())
		//fmt.Fprintln(w, doc.Data())
	}
	for _, doc := range rapiditer {
		arr = append(arr, doc.Data())
	}

	json.NewEncoder(w).Encode(arr)
}

func getReport(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client := createClient(ctx)
	reportID := chi.URLParam(r, "reportId")
	reportType := chi.URLParam(r, "reportType")
	var collectionRef string
	switch reportType {
	case "dispatch":
		collectionRef = "dispatch-reports"
	case "rapid-response":
		collectionRef = "rapid-response-reports"
	}

	fmt.Println("report id:", reportID)
	fmt.Println("report type:", reportType)

	dsnap, err := client.Collection(collectionRef).Doc(reportID).Get(ctx)
	if err != nil {
		log.Println("Error getting report: ", err)
	}
	m := dsnap.Data()
	fmt.Printf("%T\n", m)
	json.NewEncoder(w).Encode(m)
}

func filterReports(w http.ResponseWriter, r *http.Request) {
	//ctx := context.Background()
	//client := createClient(ctx)
	doc := make(map[string]string)
	reqBody, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(reqBody, &doc); err != nil {
		fmt.Println("Error unmarshalling: ", err)
	}
	fmt.Println("filter clicked on:", doc["filter"])
}
