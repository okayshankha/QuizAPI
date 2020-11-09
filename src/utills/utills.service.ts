import { Injectable } from '@nestjs/common';

@Injectable()
export class UtillsService {
    successMessage(message?: String) {
        console.log(message);


        let finalResult: any = {};

        finalResult.status = true
        if (message) {
            finalResult.message = message
        }
        return finalResult;
    }

    errorMessage(message?: String) {
        let finalResult: any = {};

        finalResult.status = false
        if (message) {
            finalResult.message = message
        }
        return finalResult;
    }

    singleResultWarp(result: any[]) {
        if (result) {
            let length = result.length;

            if (length > 0) result = result[0]
            else result = null

            return this.prepareResult(result);
        } else {
            throw new Error("Undefined Object Received!");
        }
    }

    multiResultWarp(result: any[], query?: any) {
        if (result) {
            let length = result.length;

            if (length <= 0) result = null

            return this.prepareResult(result, query);

        } else {
            throw new Error("Undefined Object Received!");
        }
    }

    prepareResult(result: any, query?: any) {
        let finalResult: any = {};
        if (result) {
            finalResult.status = true;
            finalResult.message = "Record(s) fetched successfully";
            if (query) {
                finalResult.perPage = (query.perPage && query.perPage > 0 && query.perPage <= 50) ? query.perPage : 10;
                finalResult.page = (query.page && query.page > 0) ? query.page : 1;
            }
            finalResult.result = result
        } else {
            finalResult.status = false;
            finalResult.message = "No record(s) found";
        }

        return finalResult;
    }
}
