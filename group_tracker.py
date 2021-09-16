import PySimpleGUI as sg
import calendar
from datetime import datetime, timedelta
import sys
import json
import os
from fpdf import FPDF

DB_FILENAME = 'data.json'
DATA = None


folder_path = os.path.dirname(os.path.realpath(__file__))

with open(DB_FILENAME, 'r') as f:
    DATA = json.load(f)

def save_data():
    '''
    Save DATA to disk at DB_FILENAME
    '''
    DATA["LAST_SAVED"] = datetime.today().strftime('%Y-%m-%d %I:%M %p')
    with open(DB_FILENAME, 'w') as f:
        json.dump(DATA, f, indent=2)

REPORT_TITLE = "River City Advocacy Group Sessions Report"

PDF_FONT = {
    'family': 'Arial',
    'size': 10,
}

HOME = 'home'
ADD_GROUP = 'Add Group Session'
CREATE_REPORT = 'Create Report'
WINDOW_TITLE = 'Group Tracker'


button_options = {
    'size': (20, 5),
    'font': 'arial 20 bold',
    'pad': 50,
}

submit_button_options = {
    'size': (7, 1),
    'font': 'arial 20 bold',
    'pad': 20,
}

header_text_options = {
    # 'size': (20, 5),
    'font': 'arial 25 bold',
    'justification': 'center',
    'pad': 50,
}

label_text_options = {
    'font': 'arial 25',
    'pad': (0, 10),
}

text_input_options = {
    'size': (20, 10),
    'font': 'arial 25',
}

text_box_options = {
    'size': (30, 10),
    'font': 'arial 20',
}

error_text_options = {
    'font': 'arial 20',
    'text_color': 'red',
}

def home_window():
    home_layout = [
        [sg.Text('Welcome to Group Tracker!', **header_text_options)],
        [sg.Button(ADD_GROUP, **button_options)],
        [sg.Button(CREATE_REPORT, **button_options)],
    ]
    return sg.Window(WINDOW_TITLE, home_layout, finalize=True, return_keyboard_events=True, element_justification='c')

def last_nonzero_index(inp):
    '''
    Return the index of the last nonzero element in inp plus 1 
    '''
    for i in range(len(inp)-1, -1, -1):
        if inp[i] != 0:
            return i + 1
        
    raise ValueError('All elements are 0')
        

# month_name = calendar.month_name[datetime.today().month]
# days = list(calendar.Calendar().itermonthdays(datetime.today().year, datetime.today().month))
# days = days[days.index(1):last_nonzero_index(days)]

# year = datetime.today().year
# years = [_ for _ in range(year-1, year+5)]

# groups = [f'Group {i}' for i in range(7)]

today_obj = datetime.today()
today = today_obj.strftime('%Y-%m-%d')
last_week = (today_obj - timedelta(weeks=1)).strftime('%Y-%m-%d')

def add_group_window():
    add_group_layout = [
        [sg.Text('Add a Group Session', **header_text_options)],
        [sg.Text('Group Name:', **label_text_options), sg.InputText(key='-GROUP-', **text_input_options)],
        [sg.Text('Date:', **label_text_options), sg.InputText(default_text=today, key='-DATE-', **text_input_options)],
        [sg.Text('Participants:', **label_text_options), sg.InputText(key='-PARTICIPANT-',**text_input_options)],
        [sg.Multiline(key='-PARTICIPANTS-', **text_input_options)],
        [sg.Text('', key='-ERROR-', visible=False, **error_text_options)],
        [sg.Button('Submit', **submit_button_options), sg.Button('Back', **submit_button_options)],        
    ]
    return sg.Window(WINDOW_TITLE, add_group_layout, finalize=True, return_keyboard_events=True, element_justification='c')

def home_event_processing(window):
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED:
            break
        elif event == ADD_GROUP:
            return ADD_GROUP
        elif event == CREATE_REPORT:
            return CREATE_REPORT

ENTER = 'Return:603979789'

def get_date(date_str):
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.strftime('%Y-%m-%d')
    except ValueError: # invalid date
        return None

def add_group_event_processing(window):
    participants = []
    while True:
        event, values = window.read()
        print(event)
        print(values)
        if event == sg.WIN_CLOSED:
            break
        elif event in ('\r', ENTER):
            new_participant = values['-PARTICIPANT-']
            if new_participant:
                participants.insert(0, new_participant)
                window['-PARTICIPANTS-'].update(value='\n'.join(participants))
                window['-PARTICIPANT-'].update(value='')
        elif event == 'Back':
            return HOME
        elif event == 'Submit':
            group_name = values['-GROUP-']
            date = get_date(values['-DATE-'])
            participants = [val for val in values['-PARTICIPANTS-'].split('\n') if val]
            error = None
            if not group_name:
                error = 'Group Name is empty'
            elif not date:
                error = 'Invalid Date, Please enter in YYYY-MM-DD format'
            elif not participants:
                error = 'No participants entered'
            
            if error:
                window['-ERROR-'].update(visible=True, value=error)
            else:
                # Submit the data
                people_db = DATA['PEOPLE']
                for name in participants:
                    name = name.lower() # might change this later
                    people_db.setdefault(name, {"SESSIONS": []})
                    people_db[name]["SESSIONS"].append([group_name, date])
                save_data()
                # clear form
                for key in ('-GROUP-', '-PARTICIPANT-', '-PARTICIPANTS-'):
                    window[key].update(value='')
                window['-DATE-'].update(value=today)
                participants.clear()
        else:
            window['-ERROR-'].update(visible=False, value='')
            
def create_report_window():
    create_report_layout = [
        [sg.Text('Generate Report', **header_text_options)],
        [sg.Text('Start Date (YYYY-MM-DD):', **label_text_options)],
        [sg.InputText(key='-START-', default_text=last_week, **text_input_options)],
        [sg.Text('End Date (YYYY-MM-DD):', **label_text_options)],
        [sg.InputText(key='-END-', default_text=today, **text_input_options)],
        [sg.Text('', key='-ERROR-', visible=False, **error_text_options)],
        [sg.FileSaveAs('PDF',initial_folder=folder_path, target="-FILEPATH-", **submit_button_options), sg.FileSaveAs('Text', initial_folder=folder_path, target="-FILEPATH-", **submit_button_options), sg.Button('Back', **submit_button_options)],
        [sg.Input(key='-FILEPATH-', enable_events=True, visible=False)]
    ] 
    return sg.Window(WINDOW_TITLE, create_report_layout, finalize=True, return_keyboard_events=True, element_justification='c')

def date_in(date_str, start, end):
    '''
    Returns true if date is in between start and end
    (date_str assumed to be str in YYYY-MM-DD format)
    (start and end assumed to be datetime objects)
    '''
    date = datetime.strptime(date_str, "%Y-%m-%d")
    return start <= date <= end 

def gen_report(start_str, end_str):
    start = datetime.strptime(start_str, '%Y-%m-%d')
    end = datetime.strptime(end_str, '%Y-%m-%d')
    start_out = start.strftime('%B %-d, %Y')
    end_out = end.strftime('%B %-d, %Y')
    now_str = datetime.today().strftime('%A, %B %-d, %Y at %-I:%M %p')
    report = REPORT_TITLE + "\n"
    report += f'Generated on {now_str}\n'
    report += f'Time Period: {start_out} to {end_out}\n'

    num_people = 0

    groups = {}
    for person, info in DATA["PEOPLE"].items():
        person_served = False
        for group_name, date in info["SESSIONS"]:
            if date_in(date, start, end):
                person_served = True
                groups.setdefault(group_name, {})
                groups[group_name].setdefault(date, [])
                groups[group_name][date].append(person)
        if person_served:
            num_people += 1

    num_groups = len(groups)
    num_sessions = sum(len(sessions) for sessions in groups.values())
    total_attendance = 0
    for group, sessions in groups.items():
        total_attendance += sum(len(session) for session in sessions.values())

    avg_attendance = round(total_attendance / num_sessions, 1)

    report += f'Number of unique people: {num_people}\n'
    report += f'Number of groups: {num_groups}\n'
    report += f'Number of sessions: {num_sessions}\n'
    report += f'Average attendance per session: {avg_attendance}\n'

    report += 'Groups:\n'
    for group, sessions in groups.items():
        report += f'\t{group}:\n'
        _people = set()
        for date, attendees in sessions.items():
            _people.update(attendees)
        report += f'\t\tNumber of unique people: {len(_people)}\n'
        report += f'\t\tNumber of sessions: {len(sessions)}\n'
        _tot_attendance = sum(len(attendees) for attendees in sessions.values())
        report += f'\t\tAverage attendance per session: {round(_tot_attendance/len(sessions), 1)}\n'

    return report

def save_pdf(report, path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font(**PDF_FONT)
    lines = report.split('\n')
    pdf.cell(200, 10, txt=lines[0], ln=1, align='C')
    for line in lines[1:]:
        for i in range(len(line)):
            if line[i] != '\t':
                break
            pdf.cell(10)
        pdf.cell(200, 5, txt=line, ln=1)
    if path.endswith('/'):
        path += 'report.pdf'
    if not path.endswith('.pdf'):
        path += '.pdf'
    pdf.output(path)

def save_txt(report, path):
    if not path.endswith('.txt'):
        path += '.txt'
    with open(path, 'w') as f:
        f.write(report)

report_save_funcs = {
    'PDF': save_pdf,
    'Text': save_txt,
}

def create_report_event_processing(window):
    while True:
        event, values = window.read()
        print(event)
        print(values)

        if event == sg.WIN_CLOSED:
            break
        elif event == 'Back':
            return HOME
        elif event == "-FILEPATH-":
            start = get_date(values['-START-'])
            end = get_date(values['-END-'])
            error = None
            if not start:
                error = 'Start'
            elif not end:
                error = 'End'
            
            if error:
                window['-ERROR-'].update(visible=True, value=f'Invalid {error} date, Please enter in YYYY-MM-DD format')
            else:
                # find the button that was pressed
                _type = None
                for key, val in values.items():
                    if key in report_save_funcs and val:
                        _type = key
                        break
                if _type: # the save was not canceled
                    # generate the report
                    report = gen_report(start, end)
                    print(report)
                    report_save_funcs[_type](report, values[_type])
        elif event == 'Save As':
            print(values['Text'])


layouts = {
    HOME: {
        'window': home_window,
        'event_processing': home_event_processing,
    },
    ADD_GROUP: {
        'window': add_group_window,
        'event_processing': add_group_event_processing,
    },
    CREATE_REPORT: {
        'window': create_report_window,
        'event_processing': create_report_event_processing,
    }
}

if __name__ == '__main__':
    current_layout = HOME
    args = sys.argv
    if 'add-group' in sys.argv:
        current_layout = ADD_GROUP
    elif 'create-report' in sys.argv:
        current_layout = CREATE_REPORT

    # sg.theme('LightGreen3')    
    # sg.theme_button_color('LightGreen3')
    # sg.change_look_and_feel('LightBrown3')
    while True:
        window = layouts[current_layout]['window']()
        window.bring_to_front()

        current_layout = layouts[current_layout]['event_processing'](window) 
        if not current_layout:
            break

        window.close()
