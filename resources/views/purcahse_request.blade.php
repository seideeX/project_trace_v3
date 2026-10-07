{{-- resources/views/pdf/purchase-request.blade.php --}}
@php
    $money = fn ($value) => number_format((float) $value, 2);

    // 260.00 -> 260, 1000.50 -> 1,000.5
    $qty = fn ($value) => rtrim(rtrim(number_format((float) $value, 2, '.', ','), '0'), '.');

    $upper = fn ($value) => $value ? \Illuminate\Support\Str::upper($value) : '';

    $prDate = $pr->pr_date ? \Carbon\Carbon::parse($pr->pr_date)->format('m/d/Y') : '';

    $items = $pr->items;
    $total = $items->isNotEmpty()
        ? $items->sum(fn ($item) => (float) $item->total_cost)
        : (float) $pr->amount;

    // Keeps the item table tall like the paper form, shrinks as items are added
    $fillerHeight = max(24, 360 - ($items->count() * 52));

    // $requester is the user who created the PR (passed from the controller)
    $requestedByName = $pr->requested_by_name ?: ($requester->name ?? '');
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Purchase Request {{ $pr->pr_no }}</title>
    <style>
        @page { margin: 30px 36px; }

        * { box-sizing: border-box; }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10pt;
            color: #000;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        td, th {
            padding: 4px 6px;
            vertical-align: top;
            word-wrap: break-word;
        }

        .box td, .box th { border: 1px solid #000; }
        .no-top td, .no-top th { border-top: none; }

        .center { text-align: center; }
        .right  { text-align: right; }
        .bold   { font-weight: bold; }
        .mid    { vertical-align: middle; }

        .appendix {
            text-align: right;
            font-style: italic;
            font-size: 9pt;
            margin: 0 0 2px;
        }

        .title {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            letter-spacing: 1px;
            margin: 0 0 10px;
        }

        .meta td { padding: 2px 4px; }
        .meta .label { font-weight: bold; }

        /* Item table: vertical rules only, like the paper form */
        .items th { border: 1px solid #000; text-align: center; vertical-align: middle; padding: 5px 4px; }
        .items td.col { border-left: 1px solid #000; border-right: 1px solid #000; }
        .items tr.total td { border: 1px solid #000; font-weight: bold; text-align: right; }

        .label { font-weight: bold; }

        .line {
            border-bottom: 1px solid #000;
            text-align: center;
            font-weight: normal;
        }

        .small { font-size: 9pt; }
        .tick  { font-family: 'DejaVu Sans', sans-serif; font-size: 9pt; }

        .inner td { padding: 2px 3px; border: none; }

        .nobreak { page-break-inside: avoid; }
    </style>
</head>
<body>

    <p class="appendix">Appendix 51</p>
    <p class="title">PURCHASE REQUEST</p>

    {{-- ENTITY / FUND CLUSTER --}}
    <table class="meta">
        <tr>
            <td style="width: 62%;">
                <span class="label">Entity Name:</span>
                <u>{{ $pr->entity_name }}</u>
            </td>
            <td style="width: 38%;">
                <span class="label">Fund Cluster:</span>
                <u>{{ $pr->fund_cluster }}</u>
            </td>
        </tr>
    </table>

    {{-- OFFICE / PR NO / DATE --}}
    <table class="box">
        <tr>
            <td style="width: 34%; height: 46px;">
                <span class="label">Office/Section:</span>
                {{ $pr->office_section }}
            </td>
            <td style="width: 40%;">
                <span class="label">PR No.:</span>
                <u>{{ $pr->pr_no }}</u>
                <br>
                <span class="label">Responsibility Center Code:</span>
                <u>{{ $pr->responsibility_center_code }}</u>
            </td>
            <td style="width: 26%;">
                <span class="label">Date:</span>
                {{ $prDate }}
            </td>
        </tr>
    </table>

    {{-- ITEMS --}}
    <table class="items">
        <thead>
            <tr>
                <th style="width: 14%;">Stock/<br>Property No.</th>
                <th style="width: 8%;">Unit</th>
                <th style="width: 38%;">Item Description</th>
                <th style="width: 10%;">Quantity</th>
                <th style="width: 14%;">Unit Cost</th>
                <th style="width: 16%;">Total Cost</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $item)
                <tr>
                    <td class="col">{{ $item->stock_property_no }}</td>
                    <td class="col center">{{ $item->unit }}</td>
                    <td class="col">{!! nl2br(e($item->item_description)) !!}</td>
                    <td class="col center">{{ $qty($item->quantity) }}</td>
                    <td class="col center">{{ $money($item->unit_cost) }}</td>
                    <td class="col right">{{ $money($item->total_cost) }}</td>
                </tr>
            @endforeach

            {{-- filler so the table keeps the paper form's height --}}
            <tr>
                <td class="col" style="height: {{ $fillerHeight }}px;">&nbsp;</td>
                <td class="col">&nbsp;</td>
                <td class="col">&nbsp;</td>
                <td class="col">&nbsp;</td>
                <td class="col">&nbsp;</td>
                <td class="col">&nbsp;</td>
            </tr>

            <tr class="total">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>{{ $money($total) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- PURPOSE --}}
    <table class="box no-top nobreak">
        <tr>
            <td class="mid center label" style="width: 14%; height: 44px;">Purpose:</td>
            <td class="mid" style="width: 86%;">{!! nl2br(e($pr->purpose)) !!}</td>
        </tr>
    </table>

    {{-- SIGNATORIES --}}
    <table class="box no-top nobreak">
        <tr>
            <td style="width: 14%;">&nbsp;</td>
            <td class="label" style="width: 28%;">Requested by:</td>
            <td class="label" style="width: 29%;">Recommending Approval:</td>
            <td class="label" style="width: 29%;">Approved by:</td>
        </tr>
        <tr>
            <td class="mid">Signature :</td>
            <td style="height: 44px;">&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td class="mid">Printed Name :</td>
            <td class="center bold small mid">{{ $upper($requestedByName) }}</td>
            <td class="center bold small mid">{{ $upper($pr->recommended_by_name) }}</td>
            <td class="center bold small mid">{{ $upper($pr->approved_by_name) }}</td>
        </tr>
        <tr>
            <td class="mid">Designation :</td>
            <td class="center mid" style="height: 36px;">{{ $pr->requested_by_designation }}</td>
            <td class="center mid">{{ $pr->recommended_by_designation }}</td>
            <td class="center mid">{{ $pr->approved_by_designation }}</td>
        </tr>
    </table>

    {{-- FOCAL PERSON / PROGRAM / IMPLEMENTATION / CERTIFIED ALLOTMENT --}}
    <table class="box no-top nobreak">
        <tr>
            {{-- Left: focal person + program details --}}
            <td rowspan="2" style="width: 38%;">
                <table class="inner">
                    <tr>
                        <td class="label" style="width: 32%;">Focal Person :</td>
                        <td class="line bold small">{{ $upper($pr->focal_person) }}</td>
                    </tr>
                </table>

                <div style="height: 54px;">&nbsp;</div>

                <table class="inner">
                    <tr>
                        <td class="label" style="width: 32%;">Program Title :</td>
                        <td class="line" style="text-align: left;">{{ $pr->program_title }}</td>
                    </tr>
                    <tr>
                        <td class="label">Fund Source :</td>
                        <td class="line" style="text-align: left;">{{ $pr->fund_source }}</td>
                    </tr>
                    <tr>
                        <td class="label">Sub-ARO No. :</td>
                        <td class="line" style="text-align: left;">{{ $pr->sub_aro_no }}</td>
                    </tr>
                </table>
            </td>

            {{-- Middle top --}}
            <td class="center bold mid" style="width: 30%; height: 34px;">Implementation Date:</td>

            {{-- Right top --}}
            <td class="center bold mid" style="width: 32%;">{{ $upper($pr->implementation_date) }}</td>
        </tr>
        <tr>
            {{-- Middle bottom: planning references --}}
            <td>
                <table class="inner">
                    <tr>
                        <td class="line" style="width: 42%;">{{ $pr->ar_atc_no }}</td>
                        <td>AR/ATC No.</td>
                    </tr>
                    <tr>
                        <td class="line tick">{!! $pr->with_wafp ? '&#10003;' : '&nbsp;' !!}</td>
                        <td>With WAFP</td>
                    </tr>
                    <tr>
                        <td class="line tick">{!! $pr->included_in_app ? '&#10003;' : '&nbsp;' !!}</td>
                        <td>Included in APP</td>
                    </tr>
                    <tr>
                        <td class="line tick">{!! $pr->included_in_ppmp ? '&#10003;' : '&nbsp;' !!}</td>
                        <td>Included in PPMP</td>
                    </tr>
                </table>
            </td>

            {{-- Right bottom: certified allotment --}}
            <td>
                <div class="center bold">Certified Allotment Available:</div>

                <div class="center bold" style="height: 40px; padding-top: 12px;">
                    @if (filled($pr->certified_allotment))
                        {{ $money($pr->certified_allotment) }}
                    @endif
                </div>

                <div class="center bold small" style="border-top: 1px solid #000; padding-top: 3px;">
                    {{ $upper($pr->certified_by_name) }}
                </div>
                <div class="center small">{{ $pr->certified_by_designation }}</div>
            </td>
        </tr>
    </table>

</body>
</html>
