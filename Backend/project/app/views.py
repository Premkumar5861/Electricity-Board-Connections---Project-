from django.shortcuts import render, HttpResponse
import pandas as pd
from .models import Applicant, Connection, Status
from datetime import datetime
import os
import json
from django.conf import settings
from django.views.generic import ListView
from django.http import JsonResponse
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.contrib.auth import authenticate,login,logout


#create your views here.
def index(request):
    return render(request, "index.html")

def login(request):
    return render(request, "login.html")

def uploaddata(request):
    try:
        filepath = os.path.join(settings.BASE_DIR, 'electricity_board_case_study.csv')
        df = pd.read_csv(filepath, encoding='latin-1')

        for index, row in df.iterrows():

            applicant, created = Applicant.objects.get_or_create(
                Applicant_Name=row['Applicant_Name'],
                Gender=row['Gender'],
                District=row['District'],
                State=row['State'],
                Pincode=row['Pincode'],
                Ownership=row['Ownership'],
                GovtID_Type=row['GovtID_Type'],
                ID_Number=row['ID_Number'],
                Category=row['Category'],
            )

            status, created = Status.objects.get_or_create(
                Status_Name=row['Status']
            )

            # Date_of_Application — define 
            Date_of_Application = datetime.strptime(
                str(row['Date_of_Application']), "%d/%m/%Y"
            ).strftime("%Y-%m-%d")

            # Date_of_Approval — None default 
            Date_of_Approval = None
            if not pd.isna(row['Date_of_Approval']):
                Date_of_Approval = datetime.strptime(
                    str(row['Date_of_Approval']), "%d/%m/%Y"
                ).strftime("%Y-%m-%d")

            # Modified_Date — define 
            Modified_Date = datetime.strptime(
                str(row['Modified_Date']), "%d/%m/%Y"
            ).strftime("%Y-%m-%d")

            Connection.objects.get_or_create(
                Applicant=applicant,
                Load_Applied=row['Load_Applied'],
                Date_of_Application=Date_of_Application,  
                Date_of_Approval=Date_of_Approval,        
                Modified_Date=Modified_Date,              
                Status=status,
                Reviewer_ID=row['Reviewer_ID'],
                Reviewer_Name=row['Reviewer_Name'],
                Reviewer_Comments=row['Reviewer_Comments'],
            )
            print(row['ID'])

    except Exception as e:
        return HttpResponse(f"Error: {e}")

    return HttpResponse("File data uploaded successfully!")

class ConnectionListView(ListView):
    model=Connection
    context_object_name='connection'
    paginate_by=100

    def get_queryset(self):
        queryset=super().get_queryset()
         #Retrieve search query from the request
        search_query=self.request.GET.get('search')
         #Retrieve data range parameters
        start_date_param=self.request.GET.get('start_date')
        end_date_param=self.request.GET.get('end_date')

         #Parse date range parameters if provided
        start_date=parse_date(start_date_param) if start_date_param else None
        end_date=parse_date(end_date_param) if end_date_param else None

    #Filter connection queryset  based on the search query
        if search_query:
            queryset=queryset.filter(id__icontains=search_query)
    #Filter connection queryset based on the date range.
        if start_date and end_date:
            queryset=queryset.filter(Date_of_Application__gte=start_date,Date_of_Application__lte=end_date)
        
        
        return queryset
    

    def get_context_data(self, **kwargs):
        context=super().get_context_data(**kwargs)
        context['search_query']=self.request.GET.get('search')
        
        return  context
    
    def render_to_response(self, context, **response_kwargs):

        page_obj = context['page_obj']


        serialized_data = [
            {

                'id': conn.id,
                'Load_Applied': conn.Load_Applied,
                'Date_of_application': conn.Date_of_Application,
                'Status': conn.Status.Status_Name,
                'Applicant': {
                    'Applicant_Name': conn.Applicant.Applicant_Name,
                    'Gender': conn.Applicant.Gender,
                    'District': conn.Applicant.District,
                    'State': conn.Applicant.State,
                    'Pincode': conn.Applicant.Pincode,
                    'Ownership': conn.Applicant.Ownership,
                    'GovtID_Type': conn.Applicant.GovtID_Type,
                    'ID_Number': str(conn.Applicant.ID_Number).split('.')[0],
                    'Category': conn.Applicant.Category,

                },

                'Reviewer_ID': conn.Reviewer_ID,
                'Reviewer_Name': conn.Reviewer_Name,
                'Reviewer_Comment': conn.Reviewer_Comments,
            }

            for conn in page_obj.object_list
        ]

        response_data = {
            'data': serialized_data,
            'search_query': context['search_query'],
            'total_pages': page_obj.paginator.num_pages,
            'current_page': page_obj.number,
        }


        return JsonResponse(response_data)
    
@csrf_exempt
def update_applicant(request,id):
    if request.method=='GET':
            try:
                applicant=Applicant.objects.get(pk=id)
                connection=Connection.objects.filter(id=id).first()
                if not connection :
                    return JsonResponse({'error' : 'Connection not found'},status=404)
                applicant=connection.Applicant
                applicant_data = {
                    
                   "Applicant_Name":applicant.Applicant_Name,
                    "Gender":applicant.Gender,
                    "District":applicant.District,
                    "State":applicant.State,
                    "Pincode":applicant.Pincode,
                    "Ownership":applicant.Ownership,
                    "GovtID_Type":applicant.GovtID_Type,
                    "ID_Number":applicant.ID_Number,
                    "Category":applicant.Category

                }


                connection_date ={

                    "Load_Applied":connection.Load_Applied,
                    "Date_of_Application":str(connection.Date_of_Application),
                    "Modified_Date":str(connection.Modified_Date),
                    "Status":connection.Status.Status_Name,   #Get the status Name
                    "Reviewer_ID":connection.Reviewer_ID,
                    "Reviewer_Name":connection.Reviewer_Name,
                    "Reviewer_Comments":connection.Reviewer_Comments

                }

                return JsonResponse({'applicant':applicant_data, 'connection':connection_date})
    
            except Applicant.DoesNotExist:

                return JsonResponse({'error':"Applicant not found"},status=404)
    
            except Connection.DoesNotExist:
                return JsonResponse({'erro':"Connection not found"},status=404)
            
    elif request.method=="POST":
        try: 
            applicant=Applicant.objects.get(pk=id)
            connection=Connection.objects.filter(id=id).first()
            if not connection :
                return JsonResponse({'error':'Connection not found'},status=404)
            applicant = connection.Applicant
            data=json.loads(request.body)
            Status_name=data.get('connection',{}).get('Status')
            Status_instance= Status.objects.filter(Status_Name=Status_name).first()
            if Status_instance:  #Check if status instance exists
                applicant_data=data.get('applicant',{})
                for key , value in applicant_data.items():
                    setattr(applicant , key , value)
                applicant.save()

                connection_date = data.get('connection',{})
                #print(connection_data)
                for key, value in connection_date.items():
                    if key != 'Status':
                        setattr(connection , key , value)
                 
                connection.Status=Status_instance   # Assign the status instance
                connection.save()
                # connection.status=status_instance # Assign the status instance 
                # connection.save()

                return JsonResponse({ 'success': 'Applicant details upload successfully'})
            else:
                return JsonResponse({'error' : 'Invalid status value' },status=400)
        except Applicant.DoesNotExist:
            return JsonResponse({'error' : 'Applicant not found'},status=404)
        except Connection.DoesNotExist:
            return JsonResponse({'error' : "Connection not found"},status=404)


def connectionvisualization(request):
    connection_requests=Connection.objects.all().values('Date_of_Application__year', 'Date_of_Application__month').annotate(total_requests=Count('id'))

    labels=[f"{x['Date_of_Application__year']}-{x['Date_of_Application__month']}" for x in connection_requests]
    total_requests = [x['total_requests'] for x in connection_requests]

    context={
        'labels' : labels,
        'total_requests': total_requests,

    }
    return render(request,'connectionvisualization.html',context)


def connectionrequestdata(request):

    selected_status=request.GET.get('status')
    if selected_status:
        filtered_connection=Connection.objects.filter(Status__Status_Name=selected_status)
    else:
        filtered_connection=Connection.objects.all()
    
    data=filtered_connection.annotate(month=TruncMonth('Date_of_Application')).values('month').annotate(
        total_requests=Count('id')
    )
    labels=[entry['month'].strftime('%B %Y') for entry in data]
    total_requests = [entry['total_requests'] for entry in data]

    return JsonResponse({'labels': labels, 'total_requests':total_requests})


@csrf_exempt
def handlelogin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username= data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'user': user.username},status=200)

            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
            
        else:
            return JsonResponse({'error': 'Username and password are required'},status=400)
        
    else:
        return JsonResponse({'error': 'method not allowed'}, status=405)



    