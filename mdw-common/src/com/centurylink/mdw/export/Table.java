package com.centurylink.mdw.export;

/**
 * Tabular presentation.
 */
public class Table {

    public Table(String[] columns, String[][] rows) {
        this.columns = columns;
        this.rows = rows;
    }

    private String[] columns;
    public String[] getColumns() { return columns; }

    private String[][] rows;
    public String[][] getRows() { return rows; }
}
